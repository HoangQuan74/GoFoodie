import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BASE_URL } from 'src/common/constants';
import { STORE_NOTIFICATION_CONTENT, STORE_NOTIFICATION_TITLE } from 'src/common/constants/notification.constant';
import { EStoreNotificationStatus, EStoreNotificationType } from 'src/common/enums';
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
    const { storeId, title, content, type } = entity;
    let imageUrl = null;

    // if (type === EStoreNotificationType.Order) {
    imageUrl = BASE_URL + '/public/noti-wallet.png';
    // }

    this.fcmService.sendNotificationToStaffs(storeId, title, content, {}, imageUrl);

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
    newNotification.status = EStoreNotificationStatus.Error;

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
    // newNotification.relatedId = orderCode;

    await this.save(newNotification);
  }

  async sendWithdrawalSuccess(storeId: number, amount: number, relatedId: number) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.WITHDRAWAL_SUCCESS;
    newNotification.content = STORE_NOTIFICATION_CONTENT.WITHDRAWAL_SUCCESS(amount);
    newNotification.type = EStoreNotificationType.Wallet;
    newNotification.relatedId = relatedId;

    await this.save(newNotification);
  }

  async sendWithdrawalFailed(storeId: number, amount: number, relatedId: number) {
    const newNotification = new StoreNotificationEntity();
    newNotification.storeId = storeId;
    newNotification.title = STORE_NOTIFICATION_TITLE.WITHDRAWAL_FAILED;
    newNotification.content = STORE_NOTIFICATION_CONTENT.WITHDRAWAL_FAILED(amount);
    newNotification.type = EStoreNotificationType.Wallet;
    newNotification.relatedId = relatedId;

    await this.save(newNotification);
  }
}
