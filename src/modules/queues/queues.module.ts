import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { OrderProcessor } from './order.processor';
import { OrdersModule } from '../merchant/order/order.module';

@Module({
  imports: [BullModule.registerQueue({ name: 'orderQueue' }), OrdersModule],
  providers: [OrderProcessor],
  exports: [BullModule],
})
export class QueuesModule {}
