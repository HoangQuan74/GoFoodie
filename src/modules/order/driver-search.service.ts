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
import { EOrderStatus } from 'src/common/enums';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { isEmpty } from 'lodash';

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

    private eventGatewayService: EventGatewayService,
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
    console.log('EligibleDrivers', eligibleDrivers)
    const scoredDrivers = await this.scoreDrivers(eligibleDrivers, order);
    const bestDriver = this.selectBestDriver(scoredDrivers);

    console.log('BestDriver', bestDriver)
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

    this.eventGatewayService.notifyDriverNewOrder(driver.id, order);
  }

  async findEligibleDrivers(order: OrderEntity): Promise<DriverEntity[]> {
    const orderCriteria = await this.orderCriteriaRepository.findOne({ where: { type: EOrderCriteriaType.Distance } });
    const distanceCriteria = orderCriteria.value ?? 1000;

    const drivers = await this.driverAvailabilityRepository
      .createQueryBuilder('driverAvailability')
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
      .setParameters({
        longtitudeOfPoint: order.store.longitude,
        latitudeOfPoint: order.store.latitude,
        distanceCriteria: distanceCriteria,
      })
      .getRawMany();
    
    console.log("get driver from database", drivers);

    if (isEmpty(drivers)) {
      return [];
    }

    const driverIds = drivers.map((driver) => driver.driverId);
    const driverAvailabilities = await this.driverRepository.find({
      where: {
        id: In(driverIds),
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
}
