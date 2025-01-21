import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EDriverApprovalStatus, EDriverStatus } from 'src/common/enums/driver.enum';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { calculateDistance } from 'src/utils/distance';
import { Repository } from 'typeorm';

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
    const scoredDrivers = await this.scoreDrivers(eligibleDrivers, order);
    const bestDriver = this.selectBestDriver(scoredDrivers);

    if (bestDriver) {
      await this.offerOrderToDriver(order, bestDriver);
    } else {
      throw new BadRequestException('No eligible drivers found for this order');
    }
  }

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

    await this.offerOrderToDriver(order, driver);
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

  private async findEligibleDrivers(order: OrderEntity): Promise<DriverEntity[]> {
    const availableDrivers = await this.driverAvailabilityRepository.find({
      where: { isAvailable: true },
      relations: ['driver', 'driver.serviceTypes', 'driver.vehicle'],
    });

    return availableDrivers
      .filter(
        (availability) =>
          availability.driver.status === EDriverStatus.Active &&
          availability.driver.approvalStatus === EDriverApprovalStatus.Approved &&
          availability.driver.serviceTypes.some((st) => st.id === order.store.serviceType.id),
      )
      .map((availability) => availability.driver);
  }

  private async scoreDrivers(
    drivers: DriverEntity[],
    order: OrderEntity,
  ): Promise<{ driver: DriverEntity; score: number }[]> {
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
          const driverAvailability = driver.driverAvailability[0]; // Assuming the latest availability
          const distance = calculateDistance(
            driverAvailability.latitude,
            driverAvailability.longitude,
            order.deliveryLatitude,
            order.deliveryLongitude,
          );
          // Lower distance should result in a higher score
          return score + (criterion.value / (distance + 1)) * criterion.priority;

        case EOrderCriteriaType.Time:
          // Assuming we have a method to estimate delivery time
          const estimatedTime = this.estimateDeliveryTime(driver, order);
          // Lower estimated time should result in a higher score
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

    // Assuming an average speed of 30 km/h
    const averageSpeed = 30;

    // Estimated time in minutes
    return (distance / averageSpeed) * 60;
  }
  private selectBestDriver(scoredDrivers: { driver: DriverEntity; score: number }[]): DriverEntity | null {
    return scoredDrivers.sort((a, b) => b.score - a.score)[0]?.driver || null;
  }

  private async offerOrderToDriver(order: OrderEntity, driver: DriverEntity): Promise<void> {
    // Implement logic to offer the order to the driver
    this.eventGatewayService.notifyDriverNewOrder(driver.id, order);
    console.log(`Offering order ${order.id} to driver ${driver.id}`);
    // This could involve sending a notification, updating the order status, etc.
  }
}
