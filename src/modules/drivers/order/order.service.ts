import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { EXCEPTIONS } from 'src/common/constants';
import { EOrderActivityStatus, EOrderStatus } from 'src/common/enums/order.enum';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { Brackets, Repository } from 'typeorm';
import { QueryOrderDto, QueryOrderHistoryDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DriverSearchService } from 'src/modules/order/driver-search.service';
import { DRIVER_SPEED } from 'src/common/constants/common.constant';
import { OrderGroupService } from '../order-group/order-group.service';

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
    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,
    @InjectRepository(OrderGroupEntity)
    private orderGroupRepository: Repository<OrderGroupEntity>,

    private eventGatewayService: EventGatewayService,
    private orderGroupService: OrderGroupService,
    private driverSearchService: DriverSearchService,
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

    if (order.store) {
      const addressParts = [
        order.store.address,
        order.store.ward?.name,
        order.store.district?.name,
        order.store.province?.name,
      ].filter(Boolean);

      order.store.address = addressParts.join(', ');
    }

    const criteria = await this.orderCriteriaRepository.findOne({
      where: { serviceTypeId: order.store.serviceType.id },
      relations: ['serviceType'],
    });

    return {
      ...order,
      criteria,
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
      relations: ['store'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if ([EOrderStatus.Pending].includes(order.status) || order.driverId !== driverId) {
      throw new BadRequestException('You cannot accept this order');
    }

    await this.orderGroupService.upsertOrderGroup(orderId, driverId);

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
    delete order.activities;
    order.driverId = null;
    order.status = EOrderStatus.SearchingForDriver;

    await this.orderRepository.save(order);
    await this.orderGroupService.updateOrderGroupByOrderId(orderId, driverId);
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

      this.eventGatewayService.handleOrderUpdated(order.id);
    } else {
      const orderActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.Delivered,
        description: 'driver_delivered_the_order',
        performedBy: `driverId:${driverId}`,
      });
      await this.orderActivityRepository.save(orderActivity);
      await this.orderGroupService.updateOrderGroupByOrderId(orderId, driverId);

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
        'store.id',
        'store.name',
        'store.address',
        'client.id',
        'client.name',
        'client.address',
        'orderInDelivery.createdAt',
        'orderDelivered.createdAt',
      ])
      .addSelect(
        'COALESCE(order.deliveryFee, 0) + COALESCE(order.tip, 0) + COALESCE(order.parkingFee, 0) + COALESCE(order.peakHourFee, 0)',
        'driverIncome',
      )
      .addSelect('order.totalAmount', 'storeRevenue');

    if (search) {
      queryBuilder
        .andWhere(
          new Brackets((qb) => {
            qb.orWhere('client.name ILIKE :search')
              .orWhere('order.orderCode ILIKE :search')
              .orWhere('store.name ILIKE :search');
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

    const { entities, raw } = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    entities.forEach((order) => {
      order.driverIncome = Number(raw.find((ord) => ord.order_id === order.id).driverIncome) || 0;
      order.storeRevenue = Number(raw.find((ord) => ord.order_id === order.id).storeRevenue) || 0;
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
}
