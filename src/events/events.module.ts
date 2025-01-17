import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventGatewayService } from './event.gateway.service';

@Module({
  providers: [EventsGateway, EventGatewayService],
  exports: [EventsGateway, EventGatewayService],
})
export class EventsModule {}
