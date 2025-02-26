import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { EventsModule } from 'src/events/events.module';
import { FcmModule } from 'src/modules/fcm/fcm.module';
import { DriverSearchService } from 'src/modules/order/driver-search.service';
import { MerchantModule } from '../merchant.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DriverSearchModule } from 'src/modules/order/driver-search.module';

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
    DriverSearchModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrdersModule {}
