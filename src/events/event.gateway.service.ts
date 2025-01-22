import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { OrderEntity } from '../database/entities/order.entity';

@Injectable()
export class EventGatewayService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  notifyMerchantNewOrder(merchantId: number, order: OrderEntity) {
    this.eventsGateway.notifyNewOrder(merchantId, order);
  }
  notifyDriverNewOrder(driverId: number, order: OrderEntity) {
    this.eventsGateway.notifyNewDelivery(driverId, order);
  }

  notifyOrderStatus(userId: number, orderId: number, status: string) {
    this.eventsGateway.notifyOrderStatus(userId, orderId, status);
  }
}
