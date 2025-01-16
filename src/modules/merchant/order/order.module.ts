import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantModule } from '../merchant.module';
import { StoreEntity } from 'src/database/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, StoreEntity]), forwardRef(() => MerchantModule)],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
