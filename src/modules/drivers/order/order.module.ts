import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverAvailabilityEntity } from 'src/database/entities/driver-availability.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DriversModule } from '../drivers.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, DriverEntity, OrderCriteriaEntity, DriverAvailabilityEntity]),
    forwardRef(() => DriversModule),
    EventsModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrdersModule {}
