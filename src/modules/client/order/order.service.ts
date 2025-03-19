import { MapboxService } from './../../mapbox/mapbox.service';
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderCode, EOrderProcessor, EOrderStatus } from 'src/common/enums/order.enum';
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
import { Brackets, DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { EXCEPTIONS, TIMEZONE } from 'src/common/constants';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { EClientNotificationType, EFeeType, ERoleType, EStoreAddressType, EUserType } from 'src/common/enums';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DRIVER_SPEED,
  REMIND_CONFIRM_TIME,
  SCAN_DRIVER_TIME,
  STORE_CONFIRM_TIME,
} from 'src/common/constants/common.constant';
import { IOrderTime } from 'src/common/interfaces/order.interface';
import { StoresService } from '../stores/stores.service';
import * as moment from 'moment-timezone';
import { ClientEntity } from 'src/database/entities/client.entity';
import { OrderCriteriaService } from 'src/modules/order-criteria/order-criteria.service';
import { OrderService as MerchantOrderService } from 'src/modules/merchant/order/order.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { CLIENT_NOTIFICATION_CONTENT, CLIENT_NOTIFICATION_TITLE } from 'src/common/constants/notification.constant';
import { AppFeeEntity } from 'src/database/entities/app-fee.entity';
import { EAppType } from 'src/common/enums/config.enum';
import { calculateClientTotalPaid, calculateDriverIncome } from 'src/utils/income';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,

    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,

    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,

    @InjectRepository(CartProductOptionEntity)
    private cartProductOptionRepository: Repository<CartProductOptionEntity>,

    @InjectRepository(AppFeeEntity)
    private appFeeRepository: Repository<AppFeeEntity>,

    @InjectQueue('orderQueue') private orderQueue: Queue,

    private eventGatewayService: EventGatewayService,
    private dataSource: DataSource,
    private readonly feeService: FeeService,
    private readonly fcmService: FcmService,
    private readonly storesService: StoresService,
    private readonly orderCriteriaService: OrderCriteriaService,
    private readonly mapboxService: MapboxService,
    private readonly merchantOrderService: MerchantOrderService,
    private readonly clientNotificationsService: NotificationsService,
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
      const client = await queryRunner.manager.findOneBy(ClientEntity, { id: clientId });
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

      const isStoreOpen = await this.storesService.checkStoreAvailable(cart.storeId);
      if (!isStoreOpen) {
        throw new BadRequestException(EXCEPTIONS.STORE_IS_CLOSED);
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
      const parkingFee = cart.store?.parkingFee ?? 0;

      const appTransactionFee = await this.feeService.getFeeFoodDeliveryByType(
        EAppType.AppDriver,
        EFeeType.Transaction,
      );
      const storeAppTransactionFee = await this.feeService.getFeeFoodDeliveryByType(
        EAppType.AppMerchant,
        EFeeType.Transaction,
      );
      const tipPercent = await this.feeService.getFeeFoodDeliveryByType(EAppType.AppDriver, EFeeType.FeeTip);
      const parkingPercent = await this.feeService.getFeeFoodDeliveryByType(EAppType.AppDriver, EFeeType.FeeParking);
      const clientAppFee = await this.feeService.getFeeFoodDeliveryByType(EAppType.AppClient, EFeeType.Service);

      const transactionFee = (appTransactionFee / 100) * deliveryFee;
      const storeTransactionFee = (storeAppTransactionFee / 100) * totalAmount;

      const driverDeliveryFee = deliveryFee - transactionFee;
      const driverParkingFee = parkingFee * (1 - parkingPercent / 100);
      const driverTip = tip * (1 - tipPercent / 100);

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
        deliveryPhone: deliveryPhone || client.phone,
        deliveryName: deliveryName || client.name,
        deliveryAddressNote,
        notes,
        tip,
        eatingTools,
        deliveryFee,
        parkingFee,
        transactionFee,
        storeTransactionFee,
        clientAppFee,
        promoPrice,
        status: EOrderStatus.OrderCreated,
        orderCode: `${EOrderCode.DeliveryNow}${formattedDate}${shortUuid.toLocaleUpperCase()}`,
        estimatedPickupTime,
        estimatedDeliveryTime,
        cartId,
        orderFeeDiscount: {
          driverDeliveryFee: driverDeliveryFee,
          driverParkingFee: driverParkingFee,
          driverTip: driverTip,
          driverPeakHourFee: 0,
        },
      });

      const storeRevenue = totalAmount - storeTransactionFee;
      const driverIncome = calculateDriverIncome(newOrder);
      const clientTotalPaid = calculateClientTotalPaid(newOrder);
      newOrder.driverIncome = driverIncome;
      newOrder.clientTotalPaid = clientTotalPaid;
      newOrder.storeRevenue = storeRevenue;

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
              : [],
          })),
        };
      });

      await queryRunner.manager.save(OrderItemEntity, orderItems);

      // Create initial order activity
      const orderActivity = this.orderActivityRepository.create({
        orderId: savedOrder.id,
        status: EOrderStatus.OrderCreated,
        description: 'order_created',
        performedBy: `client:${clientId}`,
      });
      await queryRunner.manager.save(OrderActivityEntity, orderActivity);

      // Soft delete the cart and its related entities
      await queryRunner.manager.softDelete(CartEntity, { id: cartId });
      await queryRunner.manager.softDelete(CartProductEntity, { cartId });

      await queryRunner.commitTransaction();

      const notification = new ClientNotificationEntity();
      notification.clientId = clientId;
      notification.from = cart.store?.name;
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_PENDING;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_PENDING;
      notification.type = EClientNotificationType.Order;
      notification.relatedId = savedOrder.id;
      await this.clientNotificationsService.save(notification);

      if (cart.store.autoAcceptOrder && savedOrder.id) {
        setTimeout(() => {
          this.merchantOrderService.confirmOrder(cart.store.merchantId, savedOrder.id);
        }, 3000);
      }

      this.eventGatewayService.notifyMerchantNewOrder(savedOrder.storeId, savedOrder);
      this.fcmService.notifyMerchantNewOrder(savedOrder.id);
      this.eventGatewayService.handleOrderUpdated(savedOrder.id);
      this.orderQueue.add(
        EOrderProcessor.REMIND_MERCHANT_CONFIRM_ORDER,
        { orderId: savedOrder.id },
        { delay: REMIND_CONFIRM_TIME * 1000 * 60 },
      );
      this.orderQueue.add(
        EOrderProcessor.CANCEL_ORDER,
        { orderId: savedOrder.id },
        { delay: STORE_CONFIRM_TIME * 1000 * 60 },
      );

      return this.findOne(clientId, savedOrder.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByClient(clientId: number, queryOrderDto: QueryOrderDto) {
    const { status, cancellationType, isRated, orderType } = queryOrderDto;

    const query = this.orderRepository
      .createQueryBuilder('order')
      .addSelect(['client.id', 'client.name', 'client.avatarId'])
      .leftJoin('order.client', 'client')
      .addSelect(['driver.id, driver.fullName, driver.avatar'])
      .leftJoin('order.driver', 'driver')
      .addSelect([
        'store.id',
        'store.name',
        'store.storeCode',
        'store.specialDish',
        'store.streetName',
        'store.storeAvatarId',
        'store.preparationTime',
      ])
      .leftJoin('order.store', 'store')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .loadRelationCountAndMap('order.isStoreRated', 'order.storeReviews', 'storeReviews', (qb) =>
        qb.andWhere('storeReviews.clientId = :clientId', { clientId }),
      )
      .loadRelationCountAndMap('order.isDriverRated', 'order.driverReviews', 'driverReviews', (qb) =>
        qb.andWhere('driverReviews.clientId = :clientId', { clientId }),
      )
      .where('order.clientId = :clientId');

    cancellationType && query.andWhere('activities.cancellationType = :cancellationType', { cancellationType });
    status && status.length > 0 && query.andWhere('order.status IN (:...status)', { status });

    if (isRated === true) {
      query
        .innerJoin('order.storeReviews', 'storeReviews', 'storeReviews.clientId = :clientId')
        .innerJoin('order.driverReviews', 'driverReviews', 'driverReviews.clientId = :clientId');
    } else if (isRated === false) {
      query
        .leftJoin('order.storeReviews', 'storeReviews', 'storeReviews.clientId = :clientId')
        .leftJoin('order.driverReviews', 'driverReviews', 'driverReviews.clientId = :clientId')
        .andWhere(
          new Brackets((qb) => {
            qb.where('storeReviews.clientId IS NULL').orWhere('driverReviews.clientId IS NULL');
          }),
        );
    }

    orderType && query.andWhere('order.orderType = :orderType', { orderType: orderType });

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
      .setParameters({ clientId })
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
      .loadRelationCountAndMap('order.isStoreRated', 'order.storeReviews', 'storeReviews', (qb) =>
        qb.andWhere('storeReviews.clientId = :clientId', { clientId }),
      )
      .loadRelationCountAndMap('order.isDriverRated', 'order.driverReviews', 'driverReviews', (qb) =>
        qb.andWhere('driverReviews.clientId = :clientId', { clientId }),
      )
      .where('order.id = :orderId', { orderId })
      .andWhere('order.clientId = :clientId', { clientId });

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this client`);
    }

    order.otherFee = Number(order.clientAppFee) + Number(order.parkingFee);

    return order;
  }

  async cancelOrder(clientId: number, orderId: number, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    const order = await this.findOne(clientId, orderId);

    if (order.status === EOrderStatus.Confirmed || order.status === EOrderStatus.OfferSentToDriver) {
      throw new BadRequestException(EXCEPTIONS.ORDER_IS_ACCEPTED);
    }

    if (order.status === EOrderStatus.Cancelled) {
      throw new BadRequestException(EXCEPTIONS.ORDER_IS_REJECTED);
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
        cancellationType: EUserType.Client,
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

  async updateOrderStatus(orderId: number, newStatus: EOrderStatus, userId: number): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }

      // Update order status
      order.status = newStatus;
      await queryRunner.manager.save(OrderEntity, order);

      // Create order activity
      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: newStatus,
        description: `pending_by_merchant`,
        performedBy: `${ERoleType.Client}:${userId}`,
      });
      await queryRunner.manager.save(OrderActivityEntity, orderActivity);

      // Commit transaction
      await queryRunner.commitTransaction();

      // Notify clients about the order update
      this.eventGatewayService.handleOrderUpdated(orderId);

      return order;
    } catch (error) {
      // Rollback transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release query runner
      await queryRunner.release();
    }
  }

  async initiateReorder(clientId: number, originalOrderId: number): Promise<CartEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const originalOrder = await this.orderRepository.findOne({
        where: { id: originalOrderId, clientId },
      });

      if (!originalOrder) {
        throw new NotFoundException(`Order with ID ${originalOrderId} not found for this client`);
      }

      const originalCart = await this.cartRepository.findOne({
        where: { id: originalOrder.cartId },
        withDeleted: true,
      });

      if (!originalCart) {
        throw new NotFoundException(`Cart with ID ${originalOrder.cartId} not found`);
      }

      const newCart = this.cartRepository.create({
        clientId: originalCart.clientId,
        storeId: originalCart.storeId,
      });
      const savedNewCart = await queryRunner.manager.save(newCart);

      const originalCartProducts = await this.cartProductRepository.find({
        where: { cartId: originalOrder.cartId },
        relations: ['cartProductOptions'],
        withDeleted: true,
      });

      for (const originalProduct of originalCartProducts) {
        const newCartProduct = this.cartProductRepository.create({
          cartId: savedNewCart.id,
          productId: originalProduct.productId,
          quantity: originalProduct.quantity,
          note: originalProduct.note,
        });
        const savedNewCartProduct = await queryRunner.manager.save(newCartProduct);

        if (originalProduct.cartProductOptions && originalProduct.cartProductOptions.length > 0) {
          const newCartProductOptions = originalProduct.cartProductOptions.map((option) =>
            this.cartProductOptionRepository.create({
              cartProductId: savedNewCartProduct.id,
              optionId: option.optionId,
            }),
          );
          await queryRunner.manager.save(CartProductOptionEntity, newCartProductOptions);
        }
      }

      await queryRunner.commitTransaction();
      return savedNewCart;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
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
    const MAX_DISTANCE = 1000; // Maximum allowed distance in km
    const MINUTES_PER_KM = 2; // Assume 2 minutes per km
    const DEFAULT_DELIVERY_TIME = 120; // Default to 2 hours for invalid distances

    if (distance < 0) {
      throw new Error('Distance cannot be negative');
    }

    let travelTimeMinutes: number;

    if (distance === Number.POSITIVE_INFINITY || distance > MAX_DISTANCE) {
      console.warn(`Invalid distance: ${distance}. Using default delivery time.`);
      travelTimeMinutes = DEFAULT_DELIVERY_TIME;
    } else {
      travelTimeMinutes = distance * MINUTES_PER_KM;
    }

    const estimatedDeliveryTime = new Date(pickupTime.getTime() + travelTimeMinutes * 60000);

    // Round up to the nearest 10 minutes
    estimatedDeliveryTime.setMinutes(Math.ceil(estimatedDeliveryTime.getMinutes() / 10) * 10);

    return estimatedDeliveryTime;
  }

  createQueryBuilder(alias: string) {
    return this.orderRepository.createQueryBuilder(alias);
  }

  async calculateEstimatedOrderTime(
    storeId: number,
    time: Date,
    deliveryLatitude: number,
    deliveryLongitude: number,
  ): Promise<IOrderTime> {
    const now = moment(time).tz(TIMEZONE);
    const dayOfWeek = now.day();
    const currentTime = now.hours() * 60 + now.minutes();

    const store = await this.storesService
      .createQueryBuilder('store')
      .select(['store.id', 'store.preparationTime', 'store.autoAcceptOrder'])
      .addSelect(['preparationTimes.id', 'preparationTimes.preparationTime'])
      .leftJoin(
        'store.preparationTimes',
        'preparationTimes',
        'preparationTimes.dayOfWeek = :dayOfWeek AND preparationTimes.startTime <= :currentTime AND preparationTimes.endTime >= :currentTime',
      )
      .addSelect(['addresses.id', 'addresses.lat', 'addresses.lng'])
      .leftJoin('store.addresses', 'addresses', 'addresses.type = :type')
      .setParameters({ type: EStoreAddressType.Receive, dayOfWeek, currentTime })
      .where('store.id = :storeId', { storeId })
      .getOne();

    let preparationTime = store.preparationTime;
    if (store.preparationTimes && store.preparationTimes.length > 0) {
      preparationTime = store.preparationTimes[0].preparationTime;
    }

    const driverSearchTime = SCAN_DRIVER_TIME;
    const storeConfirmTime = store.autoAcceptOrder ? 0 : STORE_CONFIRM_TIME;
    const scanDriverDistance = await this.orderCriteriaService.getDistanceScanDriver();
    const driverToStoreTime = (scanDriverDistance * 60) / 1000 / DRIVER_SPEED;

    const estimatedPickupTime = moment.max(
      now.clone().add(preparationTime, 'minutes'),
      now.clone().add(storeConfirmTime + driverSearchTime + driverToStoreTime, 'minutes'),
    );

    const origin = { lat: store.addresses[0].lat, lng: store.addresses[0].lng };
    const destination = { lat: deliveryLatitude, lng: deliveryLongitude };
    const { duration } = await this.mapboxService.getDistanceAndDuration(origin, destination);
    const estimatedDeliveryTime = estimatedPickupTime.clone().add(duration, 'seconds');

    const result: IOrderTime = {
      orderTime: now.toDate(),
      storeConfirmTime: now.clone().add(storeConfirmTime, 'minutes').toDate(),
      estimatedPickupTime: estimatedPickupTime.toDate(),
      estimatedDeliveryTime: estimatedDeliveryTime.toDate(),
      totalEstimatedTime: moment.duration(estimatedDeliveryTime.diff(now)).asMinutes(),
    };

    return result;
  }

  async createPreOrder(data: CreatePreOrderDto, clientId: number): Promise<OrderEntity> {
    const { cartId, deliveryLatitude, deliveryLongitude, deliveryPhone, deliveryName, deliveryAddressNote, orderTime } =
      data;

    return this.dataSource.transaction(async (manager) => {
      const client = await manager.findOne(ClientEntity, { select: ['id', 'name', 'phone'], where: { id: clientId } });

      const cart = await manager
        .createQueryBuilder(CartEntity, 'cart')
        .innerJoinAndSelect('cart.cartProducts', 'cartProducts')
        .leftJoinAndSelect('cartProducts.product', 'product')
        .leftJoinAndSelect('cartProducts.cartProductOptions', 'cartProductOptions')
        .leftJoinAndSelect('cartProductOptions.option', 'option')
        .leftJoinAndSelect('option.optionGroup', 'optionGroup')
        .addSelect(['store.id', 'store.latitude', 'store.longitude'])
        .leftJoin('cart.store', 'store')
        .where('cart.id = :cartId', { cartId })
        .andWhere('cart.clientId = :clientId', { clientId })
        .getOne();

      if (!cart) throw new NotFoundException(`No cart found with ID ${cartId}`);

      const totalAmount = cart.cartProducts.reduce((sum, cartProduct) => {
        const productPrice = cartProduct.product.price;
        const optionsPrice = cartProduct.cartProductOptions.reduce((optSum, option) => optSum + option.option.price, 0);
        return sum + (productPrice + optionsPrice) * cartProduct.quantity;
      }, 0);
      const totalQuantity = cart.cartProducts.reduce((sum, cartProduct) => sum + cartProduct.quantity, 0);

      const storeAddress = await this.storesService.getStoreReceiveAddress(cart.storeId);
      if (!storeAddress) throw new BadRequestException('Store address not found');

      const distance = calculateDistance(storeAddress.lat, storeAddress.lng, deliveryLatitude, deliveryLongitude);
      const deliveryFee = await this.feeService.getShippingFee(distance);

      const formattedDate = formatDate(new Date());
      const shortUuid = generateShortUuid();

      const newOrder = new OrderEntity();
      Object.assign(newOrder, data);
      newOrder.clientId = clientId;
      newOrder.storeId = cart.store.id;
      newOrder.totalAmount = totalAmount;
      newOrder.totalQuantity = totalQuantity;
      newOrder.deliveryPhone = deliveryPhone || client.phone;
      newOrder.deliveryName = deliveryName || client.name;
      newOrder.deliveryAddressNote = deliveryAddressNote;
      newOrder.deliveryFee = deliveryFee;
      newOrder.status = EOrderStatus.OrderCreated;
      newOrder.orderType = EOrderCode.PreOrder;
      newOrder.orderCode = `${EOrderCode.PreOrder}${formattedDate}${shortUuid.toLocaleUpperCase()}`;
      newOrder.orderTime = orderTime;
      newOrder.estimatedDeliveryTime = orderTime;

      const order = await manager.save(newOrder);

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
          orderId: order.id,
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
              : [],
          })),
        };
      });

      await manager.save(OrderItemEntity, orderItems);

      // Create initial order activity
      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: EOrderStatus.OrderCreated,
        description: 'order_created',
        performedBy: `client:${clientId}`,
      });
      await manager.save(OrderActivityEntity, orderActivity);

      // Soft delete the cart and its related entities
      await manager.softDelete(CartEntity, { id: cartId });
      await manager.softDelete(CartProductEntity, { cartId });

      const notification = new ClientNotificationEntity();
      notification.clientId = clientId;
      notification.from = cart.store?.name;
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_PENDING;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_PENDING;
      notification.type = EClientNotificationType.Order;
      notification.relatedId = order.id;
      await this.clientNotificationsService.save(notification);

      this.eventGatewayService.notifyMerchantNewOrder(order.storeId, order);
      this.fcmService.notifyMerchantNewOrder(order.id);
      this.eventGatewayService.handleOrderUpdated(order.id);

      setTimeout(() => {
        this.updateOrderStatus(+order.id, EOrderStatus.Pending, clientId);
      }, 3000);

      return order;
    });
  }
}
