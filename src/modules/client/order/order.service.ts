import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderCode, EOrderStatus } from 'src/common/enums/order.enum';
import { Group } from 'src/common/interfaces/order-item.interface';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderItemEntity } from 'src/database/entities/order-item.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { FeeService } from 'src/modules/fee/fee.service';
import { formatDate, generateShortUuid } from 'src/utils/common';
import { calculateDistance } from 'src/utils/distance';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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
    const {
      cartId,
      deliveryAddress,
      deliveryLatitude,
      deliveryLongitude,
      deliveryPhone,
      deliveryName,
      deliveryAddressNote,
      notes,
      tip,
      eatingTools,
      promoPrice,
    } = createOrderDto;

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

      const totalQuantity = cart.cartProducts.reduce((sum, cartProduct) => sum + cartProduct.quantity, 0);

      const distance = calculateDistance(
        cart.store.latitude,
        cart.store.longitude,
        deliveryLatitude,
        deliveryLongitude,
      );
      const deliveryFee = await this.feeService.getShippingFee(distance);

      const formattedDate = formatDate(new Date());
      const shortUuid = generateShortUuid();

      // Calculate estimated pickup and delivery times
      const now = new Date();
      const estimatedPickupTime = this.calculateEstimatedPickupTime(now, cart.store);
      const estimatedDeliveryTime = this.calculateEstimatedDeliveryTime(estimatedPickupTime, distance);

      const newOrder = this.orderRepository.create({
        clientId,
        storeId: cart.store.id,
        totalAmount,
        totalQuantity,
        deliveryAddress,
        deliveryLatitude,
        deliveryLongitude,
        deliveryPhone,
        deliveryName,
        deliveryAddressNote,
        notes,
        tip,
        eatingTools,
        deliveryFee,
        promoPrice,
        status: EOrderStatus.Pending,
        orderCode: `${EOrderCode.DeliveryNow}${formattedDate}${shortUuid.toLocaleUpperCase()}`,
        estimatedPickupTime,
        estimatedDeliveryTime,
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
      this.eventGatewayService.handleOrderUpdated(savedOrder.id);

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
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.ward', 'ward')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.driver', 'driver')
      .where('order.id = :orderId', { orderId })
      .andWhere('order.clientId = :clientId', { clientId });

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this client`);
    }

    if (order.store) {
      const addressParts = [
        order.store.address,
        order.store.ward?.name,
        order.store.district?.name,
        order.store.province?.name,
      ].filter(Boolean);

      order.store.address = addressParts.join(', ');
    }

    return order;
  }

  async cancelOrder(clientId: number, orderId: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(clientId, orderId);

    if (order.status !== EOrderStatus.Pending) {
      throw new BadRequestException('There is no permission to cancel orders', 'ORDER_NOT_CANCELLABLE');
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

      this.eventGatewayService.handleOrderUpdated(order.id);

      return this.findOne(clientId, orderId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to cancel order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  private calculateEstimatedPickupTime(orderTime: Date, store: StoreEntity): Date {
    // t1: current time
    // x: store preparation time (assumed to be stored in store entity)
    // y: driver travel time to store (assumed to be 15 minutes for now)
    // z: driver search time (assumed to be 5 minutes for now)

    const t1 = orderTime;
    const x = store.preparationTime || 20;
    const y = 15;
    const z = 5;

    const estimatedPickupTime = new Date(t1.getTime() + (x + y + z) * 60000);

    // Round up to the nearest 10 minutes
    estimatedPickupTime.setMinutes(Math.ceil(estimatedPickupTime.getMinutes() / 10) * 10);

    return estimatedPickupTime;
  }

  private calculateEstimatedDeliveryTime(pickupTime: Date, distance: number): Date {
    // t: travel time from store to customer (assume 2 minutes per km for now)
    const t = distance * 2;

    const estimatedDeliveryTime = new Date(pickupTime.getTime() + t * 60000);

    // Round up to the nearest 10 minutes
    estimatedDeliveryTime.setMinutes(Math.ceil(estimatedDeliveryTime.getMinutes() / 10) * 10);

    return estimatedDeliveryTime;
  }
}
