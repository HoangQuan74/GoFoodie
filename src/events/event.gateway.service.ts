import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { OrderEntity } from '../database/entities/order.entity';
import { ERoleType } from 'src/common/enums';

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
}
