import { Module } from '@nestjs/common';
import { DriverSearchService } from './driver-search.service';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from 'src/events/events.module';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { NotificationsModule } from '../client/notifications/notifications.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DriverAvailabilityEntity,
      OrderCriteriaEntity,
      OrderEntity,
      DriverEntity,
      OrderActivityEntity,
      OrderGroupEntity,
      OrderGroupItemEntity,
    ]),
    EventsModule,
    forwardRef(() => QueuesModule),
    NotificationsModule,
  ],

  providers: [DriverSearchService],
  exports: [DriverSearchService],
})
export class DriverSearchModule {}
