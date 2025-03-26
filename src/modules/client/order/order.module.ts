import { NotificationsModule } from './../notifications/notifications.module';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CartProductOptionEntity } from 'src/database/entities/cart-product-option.entity';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { CartEntity } from 'src/database/entities/cart.entity';
import { OrderItemEntity } from 'src/database/entities/order-item.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { ClientModule } from '../clients/client.module';
import { EventsModule } from 'src/events/events.module';
import { OrderActivityEntity } from 'src/database/entities/order-activities.entity';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { FeeService } from 'src/modules/fee/fee.service';
import { QueuesModule } from 'src/modules/queues/queues.module';
import { StoresModule } from '../stores/stores.module';
import { OrderCriteriaModule } from 'src/modules/order-criteria/order-criteria.module';
import { MapboxModule } from 'src/modules/mapbox/mapbox.module';
import { OrdersModule as MerchantOrdersModule } from 'src/modules/merchant/order/order.module';
import { AppFeeEntity } from 'src/database/entities/app-fee.entity';
import { NotificationsModule as MerchantNotificationsModule } from 'src/modules/merchant/notifications/notifications.module';
import { FeeModule } from 'src/modules/fee/fee.module';
import { VouchersModule } from '../vouchers/vouchers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemEntity,
      CartEntity,
      CartProductEntity,
      CartProductOptionEntity,
      OrderActivityEntity,
      FeeEntity,
      AppFeeEntity,
    ]),
    forwardRef(() => ClientModule),
    EventsModule,
    QueuesModule,
    StoresModule,
    OrderCriteriaModule,
    MapboxModule,
    forwardRef(() => MerchantOrdersModule),
    NotificationsModule,
    MerchantNotificationsModule,
    FeeModule,
    VouchersModule,
  ],
  providers: [OrderService, FeeService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrdersModule {}
