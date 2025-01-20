import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantModule } from '../merchant.module';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EventsModule } from 'src/events/events.module';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, StoreEntity, OrderActivityEntity]),
    forwardRef(() => MerchantModule),
    EventsModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule {}
