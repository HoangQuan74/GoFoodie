import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { ClientModule } from '../client.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, CartEntity]), forwardRef(() => ClientModule)],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
