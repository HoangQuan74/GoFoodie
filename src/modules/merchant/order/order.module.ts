import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantModule } from '../merchant.module';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EventsModule } from 'src/events/events.module';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderService as DriverOrderService } from '../../drivers/order/order.service';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { FcmModule } from 'src/modules/fcm/fcm.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      StoreEntity,
      OrderActivityEntity,
      DriverEntity,
      OrderCriteriaEntity,
      DriverAvailabilityEntity,
    ]),
    forwardRef(() => MerchantModule),
    EventsModule,
    FcmModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, DriverOrderService],
  exports: [OrderService],
})
export class OrdersModule {}
