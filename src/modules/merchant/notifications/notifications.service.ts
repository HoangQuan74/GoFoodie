import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { STORE_NOTIFICATION_CONTENT, STORE_NOTIFICATION_TITLE } from 'src/common/constants/notification.constant';
import { EStoreNotificationType } from 'src/common/enums';
import { StoreNotificationEntity } from 'src/database/entities/store-notification.entity';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(StoreNotificationEntity)
    private notificationRepository: Repository<StoreNotificationEntity>,

    private readonly fcmService: FcmService,
  ) {}

  createQueryBuilder(alias?: string) {
    return this.notificationRepository.createQueryBuilder(alias);
  }

  findOne(options: FindOneOptions<StoreNotificationEntity>) {
    return this.notificationRepository.findOne(options);
  }

  save(entity: StoreNotificationEntity) {
    const { storeId, title, content } = entity;
    this.fcmService.sendNotificationToStaffs(storeId, title, content);

    return this.notificationRepository.save(entity);
  }

  update(criteria: FindOptionsWhere<StoreNotificationEntity>, data: Partial<StoreNotificationEntity>) {
    return this.notificationRepository.update(criteria, data);
  }

  async sendNewPreOrder(storeId: number, orderId: number, orderCode: string) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.PRE_ORDER_NEW;
    newNotification.content = STORE_NOTIFICATION_CONTENT.PRE_ORDER_NEW(orderCode);
    newNotification.type = EStoreNotificationType.Order;
    newNotification.relatedId = orderId;

    await this.save(newNotification);
  }

  async sendNewOrder(storeId: number, orderId: number, orderCode: string) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.ORDER_NEW;
    newNotification.content = STORE_NOTIFICATION_CONTENT.ORDER_NEW(orderCode);
    newNotification.type = EStoreNotificationType.Order;
    newNotification.relatedId = orderId;

    await this.save(newNotification);
  }

  async sendOrderCancelled(storeId: number, from: string, reason: string) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.ORDER_CANCELLED;
    newNotification.content = STORE_NOTIFICATION_CONTENT.ORDER_CANCELLED(from, reason);
    newNotification.type = EStoreNotificationType.Order;

    await this.save(newNotification);
  }

  async sendOrderCompleted(storeId: number, orderCode: string) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.ORDER_COMPLETED;
    newNotification.content = STORE_NOTIFICATION_CONTENT.ORDER_COMPLETED(orderCode);
    newNotification.type = EStoreNotificationType.Order;

    await this.save(newNotification);
  }

  async sendOrderConfirmed(storeId: number, orderCode: string) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.ORDER_CONFIRMED;
    newNotification.content = STORE_NOTIFICATION_CONTENT.ORDER_CONFIRMED(orderCode);
    newNotification.type = EStoreNotificationType.Order;

    await this.save(newNotification);
  }

  async sendWithdrawalSuccess(storeId: number, amount: number) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.WITHDRAWAL_SUCCESS;
    newNotification.content = STORE_NOTIFICATION_CONTENT.WITHDRAWAL_SUCCESS(amount);
    newNotification.type = EStoreNotificationType.Wallet;

    await this.save(newNotification);
  }
}
