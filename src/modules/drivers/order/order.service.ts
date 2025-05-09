import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import {
  DURATION_CONFIRM_ORDER,
  EXCEPTIONS,
  ORDER_BURST_DURATION_MIN,
  ORDER_BURST_THRESHOLD,
  RADIUS_OF_ORDER_DISPLAY_LOOKING_FOR_DRIVER,
  TIMEZONE,
} from 'src/common/constants';
import { EOrderActivityStatus, EOrderStatus } from 'src/common/enums/order.enum';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { Brackets, Repository } from 'typeorm';
import { QueryOrderDto, QueryOrderHistoryDto, QueryOrderSearchingDriverDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DriverSearchService } from 'src/modules/order/driver-search.service';
import { OrderGroupService } from '../order-group/order-group.service';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { CLIENT_NOTIFICATION_CONTENT, CLIENT_NOTIFICATION_TITLE } from 'src/common/constants/notification.constant';
import { EClientNotificationType } from 'src/common/enums';
import { NotificationsService } from 'src/modules/client/notifications/notifications.service';
import { StoreEntity } from 'src/database/entities/store.entity';
import { NotificationsService as MerchantNotificationService } from 'src/modules/merchant/notifications/notifications.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,

    @InjectRepository(OrderCriteriaEntity)
    private orderCriteriaRepository: Repository<OrderCriteriaEntity>,

    @InjectRepository(DriverAvailabilityEntity)
    private driverAvailabilityRepository: Repository<DriverAvailabilityEntity>,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,

    private eventGatewayService: EventGatewayService,
    private orderGroupService: OrderGroupService,
    private driverSearchService: DriverSearchService,
    private clientNotificationService: NotificationsService,
    private merchantNotificationService: MerchantNotificationService,
  ) {}

  async assignOrderToSpecificDriver(orderId: number, driverId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['store', 'store.serviceType'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const driver = await this.driverRepository.findOne({
      where: { id: driverId },
      relations: ['serviceTypes', 'driverAvailability'],
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found`);
    }

    if (!driver.serviceTypes.some((st) => st.id === order.store.serviceType.id)) {
      throw new BadRequestException('Driver does not provide the required service type for this order');
    }

    if (!driver.driverAvailability[0]?.isAvailable) {
      throw new BadRequestException('Driver is not currently available');
    }

    await this.driverSearchService.offerOrderToDriver(order, driver);
  }

  async updateDriverAvailability(
    driverId: number,
    isAvailable: boolean,
    latitude: number,
    longitude: number,
  ): Promise<DriverAvailabilityEntity> {
    let availability = await this.driverAvailabilityRepository.findOne({ where: { driverId } });

    if (!availability) {
      availability = this.driverAvailabilityRepository.create({ driverId });
    }

    availability.isAvailable = isAvailable;
    availability.latitude = latitude;
    availability.longitude = longitude;
    availability.lastUpdated = new Date();

    return this.driverAvailabilityRepository.save(availability);
  }

  async getOrderDetailsForDriver(orderId: number, driverId: number) {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .leftJoinAndMapOne(
        'order.orderStoreConfirmed',
        'order.activities',
        'orderStoreConfirmed',
        'orderStoreConfirmed.orderId = order.id AND orderStoreConfirmed.status = :statusStoreConfirmed',
        { statusStoreConfirmed: EOrderStatus.Confirmed },
      )
      .leftJoinAndMapOne(
        'order.orderSystemAssignToDriver',
        'order.activities',
        'orderSystemAssignToDriver',
        `orderSystemAssignToDriver.orderId = order.id 
        AND orderSystemAssignToDriver.status = :statusSystemAssignToDriver 
        AND orderSystemAssignToDriver.performedBy = :performedBy`,
        { statusSystemAssignToDriver: EOrderStatus.OfferSentToDriver, performedBy: `driverId:${driverId}` },
      )
      .leftJoinAndMapOne(
        'order.orderInDelivery',
        'order.activities',
        'orderInDelivery',
        'orderInDelivery.orderId = order.id AND orderInDelivery.status = :statusInDelivery',
        { statusInDelivery: EOrderStatus.InDelivery },
      )
      .leftJoinAndMapOne(
        'order.orderDelivered',
        'order.activities',
        'orderDelivered',
        'orderDelivered.orderId = order.id AND orderDelivered.status = :statusDelivered',
        { statusDelivered: EOrderStatus.Delivered },
      )
      .leftJoinAndMapOne(
        'order.driverCancelOrder',
        'order.activities',
        'driverCancelOrder',
        'driverCancelOrder.orderId = order.id AND (driverCancelOrder.description = :descriptionDeclined OR driverCancelOrder.description = :descriptionCancelled)',
        {
          descriptionDeclined: EOrderActivityStatus.DRIVER_REJECTED,
          descriptionCancelled: EOrderActivityStatus.DRIVER_APPROVED_AND_REJECTED,
        },
      )
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.ward', 'ward')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('store.serviceType', 'serviceType')
      .leftJoin('order.client', 'client')
      .leftJoin('order.driver', 'driver')
      .where('order.id = :orderId', { orderId })
      .addSelect([
        'client.id',
        'client.name',
        'client.email',
        'client.phone',
        'client.latitude',
        'client.longitude',
        'client.address',
        'client.avatarId',
        'driver.id',
        'driver.fullName',
        'driver.phoneNumber',
        'driver.email',
        'driver.avatar',
        'driver.temporaryAddress',
      ])
      .getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.driverId && order.driverId !== driverId) {
      throw new BadRequestException('You do not have permission to view this order');
    }

    const criteria = await this.orderCriteriaRepository.findOne({
      where: { serviceTypeId: order.store.serviceType.id, type: EOrderCriteriaType.Time },
      relations: ['serviceType'],
    });

    const createdAt = moment(order.orderSystemAssignToDriver?.createdAt).tz(TIMEZONE).unix();
    const now = moment().tz(TIMEZONE).unix();

    const remaining = (criteria?.value || DURATION_CONFIRM_ORDER) - (now - createdAt) || DURATION_CONFIRM_ORDER;

    return {
      ...order,
      criteria,
      remaining: remaining > 0 ? remaining : 0,
    };
  }

  async getOrderCancelDetailsForDriver(id: number, driverId: number) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.id = :id', { id })
      .innerJoinAndMapOne(
        'order.orderActivityCancelled',
        'order.activities',
        'orderActivityCancelled',
        'orderActivityCancelled.status = :activityStatus and orderActivityCancelled.description = :description and orderActivityCancelled.performedBy = :performedBy',
        {
          activityStatus: EOrderStatus.SearchingForDriver,
          description: EOrderActivityStatus.DRIVER_APPROVED_AND_REJECTED,
          performedBy: `driverId:${driverId}`,
        },
      )
      .select([
        'order.id',
        'order.orderCode',
        'order.totalAmount',
        'orderActivityCancelled.id',
        'orderActivityCancelled.createdAt',
        'orderActivityCancelled.performedBy',
        'orderActivityCancelled.cancellationReason',
        'orderActivityCancelled.cancellationType',
        'orderActivityCancelled.description',
      ]);

    const result = await queryBuilder.getOne();
    if (!result) {
      throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    }

    return {
      refundAmount: Number(result.totalAmount),
      ...result,
    };
  }

  async acceptOrderByDriver(orderId: number, driverId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['store', 'client'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if ([EOrderStatus.Pending].includes(order.status) || (order.driverId && order.driverId !== driverId)) {
      throw new BadRequestException('You cannot accept this order');
    }

    if (!order.driverId) {
      await this.orderGroupService.upsertOrderGroup(orderId, driverId);
      order.driverId = driverId;
      this.eventGatewayService.handleDeleteOrderSearchingForDriver(orderId);
    }
    await this.orderGroupService.updateOrderGroupItem({
      orderId,
      driverId,
      isConfirmByDriver: true,
    });

    order.status = EOrderStatus.DriverAccepted;
    await this.orderRepository.save(order);

    this.eventGatewayService.notifyMerchantNewOrder(order.store.id, order);

    this.eventGatewayService.handleOrderUpdated(order.id);

    const orderActivity = this.orderActivityRepository.create({
      orderId: orderId,
      status: EOrderStatus.DriverAccepted,
      description: 'driver_accepted_the_order',
      performedBy: `driverId:${driverId}`,
    });
    await this.orderActivityRepository.save(orderActivity);

    const notification = new ClientNotificationEntity();
    notification.clientId = order.clientId;
    notification.from = order.store?.name;
    notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_DRIVER_ARRIVING;
    notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_DRIVER_ARRIVING;
    notification.type = EClientNotificationType.Order;
    notification.relatedId = order.id;
    await this.clientNotificationService.save(notification);

    return order;
  }

  async rejectOrderByDriver(orderId: number, driverId: number, updateOrderDto: UpdateOrderDto): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['activities'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if ([EOrderStatus.Pending].includes(order.status) || order.driverId !== driverId) {
      throw new BadRequestException('You cannot reject this order');
    }

    const driverWasRejected = order.activities.some((activity) => {
      return (
        activity.status === EOrderStatus.SearchingForDriver &&
        activity.performedBy === `driverId:${driverId}` &&
        [EOrderActivityStatus.DRIVER_APPROVED_AND_REJECTED, EOrderActivityStatus.DRIVER_REJECTED].includes(
          activity.description as EOrderActivityStatus,
        )
      );
    });

    if (!driverWasRejected) {
      const orderActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.SearchingForDriver,
        description:
          order.status === EOrderStatus.DriverAccepted
            ? EOrderActivityStatus.DRIVER_APPROVED_AND_REJECTED
            : EOrderActivityStatus.DRIVER_REJECTED,
        cancellationReason: updateOrderDto.reasons || '',
        performedBy: `driverId:${driverId}`,
      });

      await this.orderActivityRepository.save(orderActivity);
    }

    await this.orderGroupService.rejectOrderGroupItem(orderId, driverId);

    delete order.activities;
    order.driverId = null;
    order.status = EOrderStatus.SearchingForDriver;

    await this.orderRepository.save(order);
    await this.orderGroupService.updateOrderGroupByDriverId(driverId);
    await this.driverSearchService.assignOrderToDriver(orderId);

    this.eventGatewayService.handleOrderUpdated(order.id);
  }

  async updateStatus(orderId: number, driverId: number, status: EOrderStatus): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.driverId !== driverId) {
      throw new BadRequestException('You cannot update this order');
    }

    order.driverId = driverId;
    order.status = status;

    await this.orderRepository.save(order);

    if (status === EOrderStatus.InDelivery) {
      const orderActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.InDelivery,
        description: 'driver_in_delivery_the_order',
        performedBy: `driverId:${driverId}`,
      });
      await this.orderActivityRepository.save(orderActivity);

      const notification = new ClientNotificationEntity();
      notification.clientId = order.clientId;
      notification.from = '';
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_DRIVER_DELIVERING;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_DRIVER_DELIVERING;
      notification.type = EClientNotificationType.Order;
      notification.relatedId = order.id;
      await this.clientNotificationService.save(notification);
      await this.merchantNotificationService.sendOrderCompleted(order.storeId, order.id, order.orderCode);

      this.eventGatewayService.handleOrderUpdated(order.id);
    } else {
      const orderActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.Delivered,
        description: 'driver_delivered_the_order',
        performedBy: `driverId:${driverId}`,
      });
      await this.orderActivityRepository.save(orderActivity);
      await this.orderGroupService.updateOrderGroupByDriverId(driverId);

      const notification = new ClientNotificationEntity();
      notification.clientId = order.clientId;
      notification.from = '';
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_DELIVERED;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_DELIVERED;
      notification.type = EClientNotificationType.Order;
      notification.relatedId = order.id;
      await this.clientNotificationService.save(notification);

      this.eventGatewayService.handleOrderUpdated(order.id);
    }
  }

  async findAllByClient(driverId: number, queryOrderDto: QueryOrderDto) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.driver', 'driver')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .where('order.driverId = :driverId', { driverId });

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

  async getOrderHistory(driverId: number, queryOrderDto: QueryOrderHistoryDto) {
    const { limit, page, status, search } = queryOrderDto;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.store', 'store')
      .leftJoin('order.client', 'client')
      .leftJoinAndMapOne(
        'order.orderInDelivery',
        'order.activities',
        'orderInDelivery',
        'orderInDelivery.orderId = order.id AND orderInDelivery.status = :statusInDelivery',
        { statusInDelivery: EOrderStatus.InDelivery },
      )
      .leftJoinAndMapOne(
        'order.orderDelivered',
        'order.activities',
        'orderDelivered',
        'orderDelivered.orderId = order.id AND orderDelivered.status = :statusDelivered',
        { statusDelivered: EOrderStatus.Delivered },
      )
      .select([
        'order.id',
        'order.orderCode',
        'order.createdAt',
        'order.totalAmount',
        'order.estimatedDeliveryTime',
        'order.driverIncome',
        'order.storeRevenue',
        'order.clientTotalPaid',
        'store.id',
        'store.name',
        'store.address',
        'client.id',
        'client.name',
        'client.address',
        'orderInDelivery.createdAt',
        'orderDelivered.createdAt',
      ]);

    if (search) {
      queryBuilder
        .andWhere(
          new Brackets((qb) => {
            qb.orWhere('unaccent(client.name) ILIKE unaccent(:search)')
              .orWhere('unaccent(order.orderCode) ILIKE unaccent(:search)')
              .orWhere('unaccent(store.name) ILIKE unaccent(:search)');
          }),
        )
        .setParameters({ search: `%${search}%` });
    }

    if (status === EOrderStatus.Cancelled) {
      queryBuilder
        .innerJoinAndMapOne(
          'order.orderActivityCancelled',
          'order.activities',
          'orderActivityCancelled',
          'orderActivityCancelled.status = :activityStatus and orderActivityCancelled.description = :description and orderActivityCancelled.performedBy = :performedBy',
          {
            activityStatus: EOrderStatus.SearchingForDriver,
            description: EOrderActivityStatus.DRIVER_APPROVED_AND_REJECTED,
            performedBy: `driverId:${driverId}`,
          },
        )
        .orderBy('orderActivityCancelled.createdAt', 'DESC');
    } else {
      queryBuilder
        .andWhere('order.driverId = :driverId', { driverId })
        .andWhere('order.status = :status', { status })
        .orderBy('orderDelivered.createdAt', 'DESC');
    }

    const count = await queryBuilder.clone().getCount();

    const entities = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    entities.forEach((order) => {
      order.driverIncome = Number(order.driverIncome) || 0;
      order.storeRevenue = Number(order.storeRevenue) || 0;
      order.totalAmount = Number(order.totalAmount) || 0;
    });

    return { orders: entities, total: count };
  }

  async getDeliveredOrdersCountToday(driverId: number) {
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    return this.orderRepository
      .createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.status = :status', { status: EOrderStatus.Delivered })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate: startOfDay, endDate: endOfDay })
      .getCount();
  }

  async getOrdersSearchingForDriver(driverId: number, query: QueryOrderSearchingDriverDto) {
    const { latitude, longitude } = query;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.store', 'store')
      .where('order.status = :orderSearchingForDriver', {
        orderSearchingForDriver: EOrderStatus.SearchingForDriver,
      })
      .andWhere('order.driverId IS NULL')
      .andWhere(
        `
        ST_DistanceSphere(
          ST_MakePoint(store.longitude, store.latitude),
          ST_MakePoint(:longtitudeOfdriver, :latitudeOfDriver)
        ) <= :distance`,
        {
          longtitudeOfdriver: longitude,
          latitudeOfDriver: latitude,
          distance: RADIUS_OF_ORDER_DISPLAY_LOOKING_FOR_DRIVER,
        },
      )
      .select(['order.id', 'order.orderCode', 'store.id', 'store.latitude', 'store.longitude']);

    const orders = await queryBuilder.getMany();
    return orders;
  }

  async getHotStoreAreas(query: QueryOrderSearchingDriverDto) {
    const { latitude, longitude } = query;
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .select(['store.id', 'store.latitude', 'store.longitude'])
      .leftJoin('store.orders', 'order')
      .where(
        'ST_DistanceSphere(ST_MakePoint(store.longitude, store.latitude),ST_MakePoint(:longtitudeOfdriver, :latitudeOfDriver)) <= :distance',
        {
          longtitudeOfdriver: longitude,
          latitudeOfDriver: latitude,
          distance: RADIUS_OF_ORDER_DISPLAY_LOOKING_FOR_DRIVER,
        },
      )
      .andWhere(
        `order.createdAt BETWEEN (NOW() AT TIME ZONE 'UTC') - (:time || ' minutes')::INTERVAL AND (NOW() AT TIME ZONE 'UTC')`,
        {
          time: ORDER_BURST_DURATION_MIN,
        },
      )
      .groupBy('store.id')
      .having('COUNT(order.id) >= :orderCount', { orderCount: ORDER_BURST_THRESHOLD });

    const stores = await queryBuilder.getMany();
    return stores;
  }
}
