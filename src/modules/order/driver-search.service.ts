import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { EDriverStatus, EDriverApprovalStatus } from 'src/common/enums/driver.enum';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';
import { calculateDistance } from 'src/utils/distance';
import { EOrderStatus, EOrderGroupStatus, EOrderProcessor } from 'src/common/enums';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { isEmpty } from 'lodash';
import { EXCEPTIONS } from 'src/common/constants';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { ORDER_GROUP_FULL } from 'src/common/constants/common.constant';
import { NotificationsService } from '../client/notifications/notifications.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class DriverSearchService {
  constructor(
    @InjectRepository(DriverAvailabilityEntity)
    private driverAvailabilityRepository: Repository<DriverAvailabilityEntity>,

    @InjectRepository(OrderCriteriaEntity)
    private orderCriteriaRepository: Repository<OrderCriteriaEntity>,

    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,

    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,

    @InjectRepository(OrderGroupEntity)
    private orderGroupRepository: Repository<OrderGroupEntity>,

    @InjectRepository(OrderGroupItemEntity)
    private orderGroupItemRepository: Repository<OrderGroupItemEntity>,

    @InjectQueue('orderQueue') private orderQueue: Queue,

    private eventGatewayService: EventGatewayService,
    // private clientNotificationService: NotificationsService,
  ) {}

  async assignOrderToDriver(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['store', 'store.serviceType'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const eligibleDrivers = await this.findEligibleDrivers(order);
    console.log('EligibleDrivers', eligibleDrivers);
    const scoredDrivers = await this.scoreDrivers(eligibleDrivers, order);
    const bestDriver = this.selectBestDriver(scoredDrivers);

    console.log('BestDriver', bestDriver);
    if (bestDriver) {
      await this.offerOrderToDriver(order, bestDriver);
    }
  }

  async offerOrderToDriver(order: OrderEntity, driver: DriverEntity): Promise<void> {
    order.driverId = driver.id;
    order.status = EOrderStatus.OfferSentToDriver;
    await this.orderRepository.save(order);

    const orderActivity = this.orderActivityRepository.create({
      orderId: order.id,
      status: EOrderStatus.OfferSentToDriver,
      description: 'offer_sent_to_driver',
      cancellationReason: '',
      performedBy: `driverId:${driver.id}`,
    });

    await this.orderActivityRepository.save(orderActivity);
    await this.upsertOrderGroup(order.id, driver.id);
    const orderCriteria = await this.orderCriteriaRepository.findOne({ where: { type: EOrderCriteriaType.Time } });
    const timeCount = orderCriteria?.value ?? 15;
    this.orderQueue.add(
      EOrderProcessor.DRIVER_NOT_ACCEPTED_ORDER,
      { orderId: order.id, driverId: driver.id },
      { delay: timeCount * 1000 },
    );

    this.eventGatewayService.notifyDriverNewOrder(driver.id, order);
  }

  async findEligibleDrivers(order: OrderEntity): Promise<DriverEntity[]> {
    const orderCriteria = await this.orderCriteriaRepository.findOne({ where: { type: EOrderCriteriaType.Distance } });
    const distanceCriteria = orderCriteria?.value ?? 10000;

    const drivers = await this.driverAvailabilityRepository
      .createQueryBuilder('driverAvailability')
      .leftJoin('driverAvailability.driver', 'driver')
      .select(
        `
        ST_DistanceSphere(
          ST_MakePoint(driverAvailability.longitude, driverAvailability.latitude),
          ST_MakePoint(:longtitudeOfPoint, :latitudeOfPoint)
        )`,
        'distance',
      )
      .addSelect('driverAvailability.driverId', 'driverId')
      .where(
        `
        ST_DistanceSphere(
          ST_MakePoint(driverAvailability.longitude, driverAvailability.latitude),
          ST_MakePoint(:longtitudeOfPoint, :latitudeOfPoint)
        ) <= :distanceCriteria`,
      )
      .andWhere('driverAvailability.isAvailable IS TRUE')
      .andWhere(
        `Not exists (
            select 1 from order_group_items ogi 
            left join order_groups og on og.id = ogi.order_group_id 
            where ogi.order_id = :orderId and og.driver_id = driver.id
          )`,
        { orderId: order.id },
      )
      .setParameters({
        longtitudeOfPoint: order.store.longitude,
        latitudeOfPoint: order.store.latitude,
        distanceCriteria: distanceCriteria,
        orderId: order.id,
      })
      .getRawMany();

    console.log('get driver from database', drivers);

    if (isEmpty(drivers)) {
      return [];
    }

    const driverIds = drivers.map((driver) => driver.driverId);

    const driverOrders = await this.orderGroupRepository
      .createQueryBuilder('orderGroup')
      .select('orderGroup.driverId', 'driverId')
      .addSelect('COUNT(orderGroupItem.id)', 'orderCount')
      .leftJoin('orderGroup.orderGroupItems', 'orderGroupItem')
      .where('orderGroup.driverId IN (:...driverIds)', { driverIds })
      .andWhere('orderGroup.status = :status', { status: EOrderGroupStatus.InDelivery })
      .groupBy('orderGroup.driverId')
      .getRawMany();

    const availableDriverIds = driverOrders
      .filter((driver) => Number(driver.orderCount) < ORDER_GROUP_FULL)
      .map((driver) => driver.driverId);

    const driversWithoutOrders = driverIds.filter(
      (driverId) => !driverOrders.some((order) => order.driverId === driverId),
    );

    const driverCanTakeIds = [...new Set([...availableDriverIds, ...driversWithoutOrders])];

    console.log('driverCanTakeIds: ', driverCanTakeIds);

    const driverAvailabilities = await this.driverRepository.find({
      where: {
        id: In(driverCanTakeIds),
        status: EDriverStatus.Active,
        approvalStatus: EDriverApprovalStatus.Approved,
      },
      relations: {
        serviceTypes: true,
        driverAvailability: true,
      },
    });
    return driverAvailabilities.filter((driverAvailabilities) =>
      driverAvailabilities.serviceTypes.some((service) => service.id === order.store.serviceTypeId),
    );
  }

  async scoreDrivers(drivers: DriverEntity[], order: OrderEntity): Promise<{ driver: DriverEntity; score: number }[]> {
    const criteria = await this.orderCriteriaRepository.find({
      where: { serviceTypeId: order.store.serviceType.id },
    });

    return drivers.map((driver) => ({
      driver,
      score: this.calculateDriverScore(driver, criteria, order),
    }));
  }

  private calculateDriverScore(driver: DriverEntity, criteria: OrderCriteriaEntity[], order: OrderEntity): number {
    return criteria.reduce((score, criterion) => {
      switch (criterion.type) {
        case EOrderCriteriaType.Distance:
          const driverAvailability = driver.driverAvailability[0];
          const distance = calculateDistance(
            driverAvailability.latitude,
            driverAvailability.longitude,
            order.deliveryLatitude,
            order.deliveryLongitude,
          );
          return score + (criterion.value / (distance + 1)) * criterion.priority;

        case EOrderCriteriaType.Time:
          const estimatedTime = this.estimateDeliveryTime(driver, order);
          return score + (criterion.value / (estimatedTime + 1)) * criterion.priority;

        default:
          return score;
      }
    }, 0);
  }

  private estimateDeliveryTime(driver: DriverEntity, order: OrderEntity): number {
    const driverAvailability = driver.driverAvailability[0];
    const distance = calculateDistance(
      driverAvailability.latitude,
      driverAvailability.longitude,
      order.deliveryLatitude,
      order.deliveryLongitude,
    );

    const averageSpeed = 30;

    return (distance / averageSpeed) * 60;
  }

  selectBestDriver(scoredDrivers: { driver: DriverEntity; score: number }[]): DriverEntity | null {
    return scoredDrivers.sort((a, b) => b.score - a.score)[0]?.driver || null;
  }

  async upsertOrderGroup(orderId: number, driverId: number) {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new BadRequestException(EXCEPTIONS.NOT_FOUND);
    }

    let orderGroup = await this.orderGroupRepository.findOne({
      where: {
        driverId: driverId,
        status: EOrderGroupStatus.InDelivery,
      },
      relations: { orderGroupItems: true },
      select: {
        id: true,
        orderGroupItems: {
          id: true,
        },
      },
    });

    if (!orderGroup) {
      orderGroup = await this.orderGroupRepository.save({
        driverId: driverId,
        status: EOrderGroupStatus.InDelivery,
      });
    } else {
      if (orderGroup.orderGroupItems?.length >= ORDER_GROUP_FULL) {
        throw new BadRequestException(EXCEPTIONS.ORDER_GROUP_FULL);
      }
    }

    return await this.orderGroupItemRepository.save({
      orderGroup: orderGroup,
      order: order,
    });
  }
}
