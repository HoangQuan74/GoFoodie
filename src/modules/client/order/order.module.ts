import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderItemEntity } from 'src/database/entities/order-item.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { ClientModule } from '../client.module';
import { EventsModule } from 'src/events/events.module';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      CartEntity,
      CartProductEntity,
      CartProductOptionEntity,
      StoreEntity,
      OrderActivityEntity,
    ]),
    forwardRef(() => ClientModule),
    EventsModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrdersModule {}
