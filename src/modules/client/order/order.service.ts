import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderCode, EOrderStatus } from 'src/common/enums/order.enum';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderItemEntity } from 'src/database/entities/order-item.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Group } from 'src/common/interfaces/order-item.interface';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { FeeService } from 'src/modules/fee/fee.service';
import { calculateDistance } from 'src/utils/distance';
import { formatDate, generateShortUuid } from 'src/utils/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,
    private eventGatewayService: EventGatewayService,
    private dataSource: DataSource,

    private readonly feeService: FeeService,
    private readonly fcmService: FcmService,
  ) {}

  async create(createOrderDto: CreateOrderDto, clientId: number): Promise<OrderEntity> {
    const { cartId, deliveryAddress, deliveryLatitude, deliveryLongitude, notes, tip, eatingTools } = createOrderDto;

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
          'cartProducts.cartProductOptions.option.optionGroup',
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

      if (!cart.store.latitude || !cart.store.longitude) {
        throw new BadRequestException('Store location is not set');
      }

      const distance = calculateDistance(
        cart.store.latitude,
        cart.store.longitude,
        deliveryLatitude,
        deliveryLongitude,
      );
      const deliveryFee = await this.feeService.getShippingFee(distance);

      const formattedDate = formatDate(new Date());
      const shortUuid = generateShortUuid();

      const newOrder = this.orderRepository.create({
        clientId,
        storeId: cart.store.id,
        totalAmount,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        notes,
        tip,
        eatingTools,
        deliveryFee,
        status: EOrderStatus.Pending,
        orderCode: `${EOrderCode.DeliveryNow.toLocaleUpperCase()}-${formattedDate}-${shortUuid.toLocaleUpperCase()}`,
      });

      const savedOrder = await queryRunner.manager.save(newOrder);

      const orderItems = cart.cartProducts.map((cartProduct) => {
        const productPrice = cartProduct.product.price;

        const groupedOptions = cartProduct.cartProductOptions.reduce((acc, opt) => {
          const groupId = opt.option.optionGroup.id;
          if (!acc[groupId]) {
            acc[groupId] = {
              optionGroup: opt.option.optionGroup,
              options: [],
            };
          }
          acc[groupId].options.push(opt.option);
          return acc;
        }, {});

        const optionsPrice = cartProduct.cartProductOptions.reduce((sum, opt) => sum + opt.option.price, 0);
        const itemPrice = productPrice + optionsPrice;

        return {
          orderId: savedOrder.id,
          productId: cartProduct.product.id,
          productName: cartProduct.product.name ?? '',
          productImage: cartProduct.product?.imageId ?? '',
          price: itemPrice,
          quantity: cartProduct.quantity,
          subtotal: itemPrice * cartProduct.quantity,
          note: cartProduct.note,
          cartProductOptions: Object.values(groupedOptions).map((group: Group) => ({
            optionGroup: {
              id: group.optionGroup.id,
              name: group.optionGroup.name,
              storeId: group.optionGroup.storeId,
              isMultiple: group.optionGroup.isMultiple,
              status: group.optionGroup.status,
              createdAt: group.optionGroup.createdAt,
              updateAt: group.optionGroup.updateAt,
            },
            options: Array.isArray(group.options)
              ? group.options.map((option) => ({
                  id: option.id,
                  name: option.name,
                  price: option.price,
                  status: option.status,
                  optionGroupId: option.optionGroupId,
                  createdAt: option.createdAt,
                  updateAt: option.updateAt,
                }))
              : {
                  id: group.options.id,
                  name: group.options.name,
                  price: group.options.price,
                  status: group.options.status,
                  optionGroupId: group.options.optionGroupId,
                  createdAt: group.options.createdAt,
                  updateAt: group.options.updateAt,
                },
          })),
        };
      });

      await queryRunner.manager.save(OrderItemEntity, orderItems);

      // Create initial order activity
      const orderActivity = this.orderActivityRepository.create({
        orderId: savedOrder.id,
        status: EOrderStatus.Pending,
        description: 'order_created',
        performedBy: `client:${clientId}`,
      });
      await queryRunner.manager.save(OrderActivityEntity, orderActivity);

      // Soft delete the cart and its related entities
      await queryRunner.manager.softDelete(CartEntity, { id: cartId });
      await queryRunner.manager.softDelete(CartProductEntity, { cartId });

      await queryRunner.commitTransaction();

      this.eventGatewayService.notifyMerchantNewOrder(savedOrder.storeId, savedOrder);
      this.fcmService.notifyMerchantNewOrder(savedOrder.id);

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
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.driver', 'driver')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .where('order.clientId = :clientId', { clientId });

    if (queryOrderDto.status) {
      query.andWhere('order.status = :status', { status: queryOrderDto.status });
    }

    if (queryOrderDto.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: queryOrderDto.paymentStatus });
    }

    if (queryOrderDto.search) {
      query.andWhere(
        '(client.name ILIKE :search OR driver.fullName ILIKE :search OR order.orderCode ILIKE :search OR CAST(order.id AS VARCHAR) ILIKE :search)',
        {
          search: `%${queryOrderDto.search}%`,
        },
      );
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
      relations: ['orderItems', 'activities', 'store', 'client', 'driver'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this client`);
    }

    return order;
  }

  async cancelOrder(clientId: number, orderId: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(clientId, orderId);

    if (order.status !== EOrderStatus.Pending) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      order.status = EOrderStatus.Cancelled;
      await queryRunner.manager.save(order);

      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: EOrderStatus.Cancelled,
        description: 'order_cancelled_by_client',
        performedBy: `client:${clientId}`,
        cancellationReason: updateOrderDto.reasons || '',
        cancellationType: 'client',
      });
      await queryRunner.manager.save(OrderActivityEntity, orderActivity);

      await queryRunner.commitTransaction();

      return this.findOne(clientId, orderId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to cancel order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
