import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderItemEntity } from 'src/database/entities/order-item.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private orderItemRepository: Repository<OrderItemEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private eventGatewayService: EventGatewayService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, clientId: number): Promise<OrderEntity> {
    const { cartId, deliveryAddress, deliveryLatitude, deliveryLongitude, notes } = createOrderDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart = await this.cartRepository.findOne({
        where: { id: cartId, clientId },
        relations: [
          'cartProducts',
          'cartProducts.product',
          'cartProducts.cartProductOptions',
          'cartProducts.cartProductOptions.option',
          'store',
        ],
      });

      if (!cart) {
        throw new NotFoundException(`Cart with ID ${cartId} not found for this client`);
      }

      if (cart.cartProducts.length === 0) {
        throw new BadRequestException('Cannot create an order with an empty cart');
      }

      const totalAmount = cart.cartProducts.reduce((sum, cartProduct) => {
        const productPrice = cartProduct.product.price;
        const optionsPrice = cartProduct.cartProductOptions.reduce((optSum, option) => optSum + option.option.price, 0);
        return sum + (productPrice + optionsPrice) * cartProduct.quantity;
      }, 0);

      const newOrder = this.orderRepository.create({
        clientId,
        storeId: cart.store.id,
        totalAmount,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        notes,
        status: EOrderStatus.Pending,
      });

      const savedOrder = await queryRunner.manager.save(newOrder);

      const orderItems = cart.cartProducts.map((cartProduct) => {
        const productPrice = cartProduct.product.price;
        const optionsPrice = cartProduct.cartProductOptions.reduce((sum, option) => sum + option.option.price, 0);
        const itemPrice = productPrice + optionsPrice;

        return this.orderItemRepository.create({
          orderId: savedOrder.id,
          productId: cartProduct.product.id,
          productName: cartProduct.product.name,
          price: itemPrice,
          quantity: cartProduct.quantity,
          subtotal: itemPrice * cartProduct.quantity,
          note: cartProduct.note,
          options: cartProduct.cartProductOptions.map((opt) => ({
            optionId: opt.option.id,
            optionName: opt.option.name,
            optionPrice: opt.option.price,
          })),
        });
      });

      await queryRunner.manager.save(OrderItemEntity, orderItems);

      // // Soft delete the cart and its related entities
      await queryRunner.manager.softDelete(CartEntity, { id: cartId });

      await queryRunner.manager.softDelete(CartProductEntity, { cartId });

      await queryRunner.commitTransaction();

      this.eventGatewayService.notifyMerchantNewOrder(savedOrder.storeId, savedOrder);

      return this.findOne(clientId, savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByClient(clientId: number, queryOrderDto: QueryOrderDto) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .where('order.clientId = :clientId', { clientId });

    if (queryOrderDto.status) {
      query.andWhere('order.status = :status', { status: queryOrderDto.status });
    }

    if (queryOrderDto.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: queryOrderDto.paymentStatus });
    }

    if (queryOrderDto.keyword) {
      query.andWhere('order.id::text LIKE :keyword', { keyword: `%${queryOrderDto.keyword}%` });
    }

    if (queryOrderDto.startDate && queryOrderDto.endDate) {
      query.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: queryOrderDto.startDate,
        endDate: queryOrderDto.endDate,
      });
    }

    query
      .orderBy(`order.${queryOrderDto.sortBy || 'createdAt'}`, queryOrderDto.sortOrder || 'DESC')
      .skip((queryOrderDto.page - 1) * queryOrderDto.limit)
      .take(queryOrderDto.limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      orders,
      total,
      page: queryOrderDto.page,
      limit: queryOrderDto.limit,
      totalPages: Math.ceil(total / queryOrderDto.limit),
    };
  }

  async findOne(clientId: number, orderId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, clientId },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this client`);
    }

    return order;
  }

  async cancelOrder(clientId: number, orderId: number): Promise<OrderEntity> {
    const order = await this.findOne(clientId, orderId);

    if (order.status !== EOrderStatus.Pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = EOrderStatus.Cancelled;
    return this.orderRepository.save(order);
  }
}
