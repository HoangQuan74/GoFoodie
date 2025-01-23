import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventGatewayService } from './event.gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [EventsGateway, EventGatewayService],
  exports: [EventsGateway, EventGatewayService],
})
export class EventsModule {}
