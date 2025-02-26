import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { OrderProcessor } from './order.processor';
import { OrdersModule } from '../merchant/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FcmModule } from '../fcm/fcm.module';
import { EventsModule } from 'src/events/events.module';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'orderQueue' }),
    TypeOrmModule.forFeature([OrderEntity, MerchantEntity, OrderActivityEntity]),
    OrdersModule,
    FcmModule,
    EventsModule,
  ],
  providers: [OrderProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
