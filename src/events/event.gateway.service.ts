import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { OrderEntity } from '../database/entities/order.entity';
import { ERoleType, ETransactionStatus } from 'src/common/enums';
import { ESocketEvent } from 'src/common/enums/socket.enum';

@Injectable()
export class EventGatewayService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  notifyMerchantNewOrder(merchantId: number, order: OrderEntity) {
    this.eventsGateway.notifyNewOrder(merchantId, order);
  }
  notifyDriverNewOrder(driverId: number, order: OrderEntity) {
    this.eventsGateway.notifyNewDelivery(driverId, order);
  }

  handleOrderUpdated(orderId: number) {
    this.eventsGateway.handleOrderUpdated(orderId);
  }

  handleUpdateRole(type: ERoleType, userIds: number[]) {
    this.eventsGateway.handleUpdateRole(type, userIds);
  }

  handleNewNotification() {
    this.eventsGateway.handleNewNotification();
  }

  handleNewOrderSearchingForDriver(order: OrderEntity) {
    this.eventsGateway.newOrderSearchingForDriver(order);
  }

  sendEventToUser(userId: number, userType: ERoleType, event: ESocketEvent, data: any) {
    this.eventsGateway.sendEventToUser(userId, userType, event, data);
  }

  handleUpdateStatusTransactionCoin(
    merchantIds: number[] = [],
    storeTransactionCoinId: number,
    status: ETransactionStatus,
  ) {
    this.eventsGateway.handleUpdateStatusTransactionCoin(merchantIds, storeTransactionCoinId, status);
  }
}
