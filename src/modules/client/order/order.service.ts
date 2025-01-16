import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderEntity, OrderStatus } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const cart = await this.cartRepository.findOne({
      where: { id: createOrderDto.cartId, clientId: createOrderDto.clientId },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${createOrderDto.cartId} not found for this client`);
    }

    if (cart.cartProducts.length === 0) {
      throw new BadRequestException('Cannot create an order with an empty cart');
    }

    const totalAmount = cart.cartProducts.reduce((sum, cartProduct) => sum + cartProduct.quantity, 0);

    const newOrder = this.orderRepository.create({
      cartId: cart.id,
      totalAmount: totalAmount,
      deliveryAddress: createOrderDto.deliveryAddress,
      deliveryLatitude: createOrderDto.deliveryLatitude,
      deliveryLongitude: createOrderDto.deliveryLongitude,
      notes: createOrderDto.notes,
    });

    return this.orderRepository.save(newOrder);
  }

  async findAllByClient(clientId: number, queryOrderDto: QueryOrderDto) {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      keyword,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10,
    } = queryOrderDto;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.cart', 'cart')
      .leftJoinAndSelect('cart.store', 'store')
      .where('cart.clientId = :clientId', { clientId });

    if (status) {
      query.andWhere('order.status = :status', { status });
    }

    if (paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus });
    }

    if (startDate && endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    if (keyword) {
      query.andWhere('(store.name LIKE :keyword OR order.id LIKE :keyword)', { keyword: `%${keyword}%` });
    }

    query
      .orderBy(`order.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(clientId: number, orderId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, cart: { clientId } },
      relations: ['cart', 'cart.store', 'cart.cartProducts', 'cart.cartProducts.product', 'driver'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this client`);
    }

    return order;
  }

  async cancelOrder(clientId: number, orderId: number): Promise<OrderEntity> {
    const order = await this.findOne(clientId, orderId);

    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.Cancelled;
    return this.orderRepository.save(order);
  }
}
