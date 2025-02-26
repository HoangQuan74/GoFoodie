import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { EventsModule } from 'src/events/events.module';
import { DriversModule } from '../drivers.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderGroupModule } from '../order-group/order-group.module';
import { DriverSearchModule } from 'src/modules/order/driver-search.module';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { NotificationsModule } from 'src/modules/client/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      DriverEntity,
      OrderCriteriaEntity,
      DriverAvailabilityEntity,
      OrderActivityEntity,
      OrderGroupEntity,
      OrderGroupItemEntity,
    ]),
    forwardRef(() => DriversModule),
    EventsModule,
    OrderGroupModule,
    DriverSearchModule,
    NotificationsModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrdersModule {}
