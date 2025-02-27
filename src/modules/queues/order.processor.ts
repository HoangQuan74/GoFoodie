import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EOrderActivityStatus, EOrderProcessor, EOrderStatus } from 'src/common/enums/order.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FcmService } from '../fcm/fcm.service';
import { StoreEntity } from 'src/database/entities/store.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { DriverSearchService } from '../order/driver-search.service';
import { OrderService as OrderDriverService } from '../drivers/order/order.service';

@Processor('orderQueue')
export class OrderProcessor extends WorkerHost {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(MerchantEntity)
    private readonly merchantRepository: Repository<MerchantEntity>,

    @InjectRepository(OrderActivityEntity)
    private readonly orderActivityRepository: Repository<OrderActivityEntity>,

    private readonly fcmService: FcmService,
    private readonly eventService: EventGatewayService,
    private readonly orderDriverService: OrderDriverService,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case EOrderProcessor.REMIND_MERCHANT_CONFIRM_ORDER:
        await this.remindMerchantConfirmOrder(job.data.orderId);
        break;
      case EOrderProcessor.CANCEL_ORDER:
        await this.cancelOrderAfter5Minutes(job.data.orderId);
        break;
      case EOrderProcessor.DRIVER_NOT_ACCEPTED_ORDER:
        await this.driverNotAcceptedOrder(job.data.orderId, job.data.driverId);
        break;
    }
  }

  async getMerchantsByStore(store: StoreEntity): Promise<MerchantEntity[]> {
    const merchants = await this.merchantRepository.find({
      where: [
        {
          storeId: store.id,
        },
        {
          id: store.merchantId,
        },
      ],
      select: {
        id: true,
        deviceToken: true,
      },
    });
    return merchants;
  }

  async getOrderPending(orderId: number): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: {
        id: orderId,
        status: EOrderStatus.Pending,
      },
      select: {
        id: true,
        store: {
          id: true,
          merchantId: true,
        },
      },
      relations: {
        store: true,
      },
    });
  }

  async remindMerchantConfirmOrder(orderId: number) {
    const order = await this.getOrderPending(orderId);
    if (!order) return;

    const merchants = await this.getMerchantsByStore(order.store);

    merchants.forEach(async (merchant) => {
      if (merchant.deviceToken) {
        this.fcmService.sendToDevice(merchant.deviceToken, 'Confirm order', 'You have a new order to confirm', {
          orderId: orderId.toString(),
        });
      }
    });
  }

  async cancelOrderAfter5Minutes(orderId: number) {
    const order = await this.getOrderPending(orderId);
    if (!order) return;

    await this.orderRepository.update({ id: orderId }, { status: EOrderStatus.Cancelled });
    const orderActivity = this.orderActivityRepository.create({
      orderId: orderId,
      status: EOrderStatus.Cancelled,
      description: EOrderActivityStatus.CANCEL_ORDER_AFTER_5_MINUTES,
      performedBy: 'system',
    });
    await this.orderActivityRepository.save(orderActivity);
    const merchants = await this.getMerchantsByStore(order.store);

    this.eventService.handleOrderUpdated(orderId);

    merchants.forEach(async (merchant) => {
      if (merchant.deviceToken) {
        this.fcmService.sendToDevice(merchant.deviceToken, 'Cancel order', 'Order was cancelled after 5 minutes', {
          orderId: orderId.toString(),
        });
      }
    });
  }

  async driverNotAcceptedOrder(orderId: number, driverId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        driverId: driverId,
        status: EOrderStatus.OfferSentToDriver,
      },
    });

    if (!order) return;

    await this.orderDriverService.rejectOrderByDriver(orderId, driverId, { reasons: 'Auto reject after confirm time' });
  }
}
