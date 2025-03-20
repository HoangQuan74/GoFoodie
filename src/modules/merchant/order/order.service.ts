import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderStatus } from 'src/common/enums/order.enum';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { DataSource, In, Repository } from 'typeorm';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderResponse } from 'src/common/interfaces/order.interface';
import { calculateStoreIncome } from 'src/utils/income';
import { EXCEPTIONS } from 'src/common/constants';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { EClientNotificationStatus, EClientNotificationType, EUserType } from 'src/common/enums';
import { DriverSearchService } from 'src/modules/order/driver-search.service';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { CLIENT_NOTIFICATION_CONTENT, CLIENT_NOTIFICATION_TITLE } from 'src/common/constants/notification.constant';
import { NotificationsService } from 'src/modules/client/notifications/notifications.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(OrderActivityEntity)
    private orderActivityRepository: Repository<OrderActivityEntity>,
    private dataSource: DataSource,

    private readonly driverSearchService: DriverSearchService,
    private readonly eventGatewayService: EventGatewayService,
    private readonly fcmService: FcmService,
    private readonly clientNotificationService: NotificationsService,
  ) {}

  async queryOrders(queryOrderDto: QueryOrderDto, storeId: number) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.driver', 'driver')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .where('order.storeId = :storeId', { storeId });

    if (queryOrderDto.status) {
      if (queryOrderDto.status === EOrderStatus.Delivered) {
        query.andWhere('order.status IN (:...status)', { status: [EOrderStatus.Delivered, EOrderStatus.InDelivery] });
      } else {
        query.andWhere('order.status = :status', { status: queryOrderDto.status });
      }
    }

    if (queryOrderDto.orderType) {
      query.andWhere('order.orderType = :orderType', { orderType: queryOrderDto.orderType });
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

    const ordersWithIncome: OrderResponse[] = orders.map((order) => ({
      ...order,
      storeIncome: calculateStoreIncome(order),
    }));

    return {
      orders: ordersWithIncome,
      total,
      page: queryOrderDto.page,
      limit: queryOrderDto.limit,
      totalPages: Math.ceil(total / queryOrderDto.limit),
    };
  }

  async confirmOrder(merchantId: number, orderId: number): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          store: {
            merchantId: merchantId,
          },
        },
        relations: ['store'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found or does not belong to this merchant`);
      }

      if (
        ![
          EOrderStatus.OfferSentToDriver,
          EOrderStatus.Pending,
          EOrderStatus.Confirmed,
          EOrderStatus.OrderCreated,
        ].includes(order.status)
      ) {
        throw new BadRequestException('Only pending orders can be confirmed');
      }

      order.status = EOrderStatus.Confirmed;
      const savedOrder = await queryRunner.manager.save(order);

      const orderActivity = this.orderActivityRepository.create({
        orderId: savedOrder.id,
        status: EOrderStatus.Confirmed,
        description: 'order_confirmed_by_merchant',
        performedBy: `merchant:${merchantId}`,
      });
      await queryRunner.manager.save(orderActivity);

      await queryRunner.commitTransaction();

      const notification = new ClientNotificationEntity();
      notification.clientId = savedOrder.clientId;
      notification.from = order.store?.name;
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_FINDING_DRIVER;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_FINDING_DRIVER;
      notification.type = EClientNotificationType.Order;
      notification.relatedId = savedOrder.id;
      await this.clientNotificationService.save(notification);

      

      this.eventGatewayService.handleOrderUpdated(order.id);

      setTimeout(() => this.searchForDriver(orderId), 3000);

      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to confirm order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
  async cancelOrder(merchantId: number, orderId: number, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          store: {
            merchantId: merchantId,
          },
        },
        relations: ['store'],
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found or does not belong to this merchant`);
      }

      if (![EOrderStatus.Pending, EOrderStatus.OfferSentToDriver].includes(order.status)) {
        throw new BadRequestException(EXCEPTIONS.NO_PERMISSION_ACTIONS);
      }

      order.status = EOrderStatus.Cancelled;
      await queryRunner.manager.save(order);

      const orderActivity = this.orderActivityRepository.create({
        orderId: order.id,
        status: EOrderStatus.Cancelled,
        description: 'order_cancelled_by_merchant',
        performedBy: `merchant:${merchantId}`,
        cancellationReason: updateOrderDto.reasons || '',
        cancellationType: EUserType.Merchant,
      });
      await queryRunner.manager.save(orderActivity);

      const notification = new ClientNotificationEntity();
      notification.clientId = order.clientId;
      notification.from = order.store?.name;
      notification.title = CLIENT_NOTIFICATION_TITLE.ORDER_CANCELLED;
      notification.content = CLIENT_NOTIFICATION_CONTENT.ORDER_CANCELLED(updateOrderDto.reasons);
      notification.type = EClientNotificationType.Order;
      notification.status = EClientNotificationStatus.Error;
      notification.relatedId = order.id;
      await this.clientNotificationService.save(notification);

      await queryRunner.commitTransaction();

      this.eventGatewayService.handleOrderUpdated(order.id);
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to cancel order: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(orderId: number, storeId: number): Promise<OrderResponse> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItems')
      .leftJoinAndSelect('order.activities', 'activities')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('store.ward', 'ward')
      .leftJoinAndSelect('store.district', 'district')
      .leftJoinAndSelect('store.province', 'province')
      .leftJoinAndSelect('order.client', 'client')
      .where('order.id = :orderId', { orderId })
      .andWhere('store.id = :storeId', { storeId });

    queryBuilder.leftJoinAndSelect('order.driver', 'driver', 'order.status != :offerSentStatus', {
      offerSentStatus: 'offer_sent_to_driver',
    });

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found for this merchant`);
    }

    if (order.status === 'offer_sent_to_driver') {
      order.driver = null;
    }

    return {
      ...order,
      storeIncome: calculateStoreIncome(order),
    };
  }

  private async searchForDriver(orderId: number): Promise<void> {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          status: In([EOrderStatus.Pending, EOrderStatus.SearchingForDriver, EOrderStatus.Confirmed]),
        },
      });
      if (!order) return;

      order.status = EOrderStatus.SearchingForDriver;
      await this.orderRepository.save(order);

      const searchingActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.SearchingForDriver,
        description: 'searching_for_driver',
        performedBy: 'system',
      });
      await this.orderActivityRepository.save(searchingActivity);
      this.eventGatewayService.handleOrderUpdated(orderId);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      await this.driverSearchService.assignOrderToDriver(orderId);

      await this.orderRepository.update({ id: orderId }, { status: EOrderStatus.OfferSentToDriver });

      const assignedActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.OfferSentToDriver,
        description: 'offer_sent_to_driver',
        performedBy: 'system',
      });
      await this.orderActivityRepository.save(assignedActivity);

      this.eventGatewayService.handleOrderUpdated(orderId);
    } catch (error) {
      console.error(error);
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
      if (order) {
        order.status = EOrderStatus.SearchingForDriver;
        await this.orderRepository.save(order);
      }

      const failureActivity = this.orderActivityRepository.create({
        orderId: orderId,
        status: EOrderStatus.SearchingForDriver,
        description: 'failed_to_assign_driver_automatically',
        performedBy: 'system',
      });
      await this.orderActivityRepository.save(failureActivity);

      this.eventGatewayService.handleOrderUpdated(orderId);
    }
  }
}
