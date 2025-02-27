import { forwardRef, Module } from '@nestjs/common';
import { OrderGroupService } from './order-group.service';
import { OrderGroupController } from './order-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DriversModule } from '../drivers.module';
import { OrderGroupEntity } from 'src/database/entities/order-group.entity';
import { OrderGroupItemEntity } from 'src/database/entities/order-group-item.entity';
import { OrderCriteriaModule } from 'src/modules/order-criteria/order-criteria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, DriverEntity, OrderGroupEntity, OrderGroupItemEntity]),
    forwardRef(() => DriversModule),
    OrderCriteriaModule,
  ],
  controllers: [OrderGroupController],
  providers: [OrderGroupService],
  exports: [OrderGroupService],
})
export class OrderGroupModule {}
