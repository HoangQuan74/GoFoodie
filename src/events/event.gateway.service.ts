import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { OrderEntity } from '../database/entities/order.entity';

@Injectable()
export class EventGatewayService {
  constructor(private readonly eventsGateway: EventsGateway) {}

  notifyMerchantNewOrder(merchantId: number, order: OrderEntity) {
    this.eventsGateway.notifyNewOrder(merchantId, order);
  }
}
