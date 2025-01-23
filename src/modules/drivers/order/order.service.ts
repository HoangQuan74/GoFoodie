import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EDriverApprovalStatus, EDriverStatus } from 'src/common/enums/driver.enum';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { calculateDistance } from 'src/utils/distance';
import { Repository } from 'typeorm';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

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

  async getOrderDetailsForDriver(orderId: number, driverId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'activities', 'store', 'client', 'driver'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (
      ![EOrderStatus.Confirmed, EOrderStatus.DriverAccepted, EOrderStatus.SearchingForDriver].includes(order.status) ||
      order.driverId !== driverId
    ) {
      throw new BadRequestException('You do not have permission to view this order');
    }

    return order;
  }

  async acceptOrderByDriver(orderId: number, driverId: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['store'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (
      ![EOrderStatus.Confirmed, EOrderStatus.DriverAccepted, EOrderStatus.SearchingForDriver].includes(order.status) ||
      order.driverId !== driverId
    ) {
      throw new BadRequestException('You cannot accept this order');
    }

    order.status = EOrderStatus.DriverAccepted;
    await this.orderRepository.save(order);

    this.eventGatewayService.notifyMerchantNewOrder(order.store.id, order);

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
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (
      ![EOrderStatus.Confirmed, EOrderStatus.DriverAccepted, EOrderStatus.SearchingForDriver].includes(order.status) ||
      order.driverId !== driverId
    ) {
      throw new BadRequestException('You cannot reject this order');
    }

    order.driverId = null;
    order.status = EOrderStatus.SearchingForDriver;

    await this.orderRepository.save(order);

    await this.assignOrderToDriver(orderId);

    const orderActivity = this.orderActivityRepository.create({
      orderId: orderId,
      status: EOrderStatus.SearchingForDriver,
      description: 'driver_rejected_the_order',
      cancellationReason: updateOrderDto.reasons || '',
      performedBy: `driverId:${driverId}`,
    });
    await this.orderActivityRepository.save(orderActivity);
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
    } else {
      const orderActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.Delivered,
        description: 'driver_delivered_the_order',
        performedBy: `driverId:${driverId}`,
      });
      await this.orderActivityRepository.save(orderActivity);
    }
  }

  async findAllByClient(clientId: number, queryOrderDto: QueryOrderDto) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities');
    // .where('order.clientId = :clientId', { clientId });

    if (queryOrderDto.status) {
      query.andWhere('order.status = :status', { status: queryOrderDto.status });
    }

    if (queryOrderDto.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: queryOrderDto.paymentStatus });
    }

    if (queryOrderDto.search) {
      query.andWhere('order.id::text ILIKE :search', { search: `%${queryOrderDto.search}%` });
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

  private selectBestDriver(scoredDrivers: { driver: DriverEntity; score: number }[]): DriverEntity | null {
    return scoredDrivers.sort((a, b) => b.score - a.score)[0]?.driver || null;
  }

  private async offerOrderToDriver(order: OrderEntity, driver: DriverEntity): Promise<void> {
    order.driverId = driver.id;
    order.status = EOrderStatus.OfferSentToDriver;
    await this.orderRepository.save(order);

    this.eventGatewayService.notifyDriverNewOrder(driver.id, order);
  }
}
