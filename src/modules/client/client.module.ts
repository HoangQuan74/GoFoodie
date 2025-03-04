import { Module } from '@nestjs/common';
import { BannersModule } from './banners/banners.module';
import { StoresModule } from './stores/stores.module';
import { AuthModule } from './auth/auth.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './order/order.module';
import { CancelOrderReasonsModule } from './cancel-order-reasons/cancel-order-reasons.module';
import { ReviewTemplatesModule } from './review-templates/review-templates.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { ClientEntity } from 'src/database/entities/client.entity';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { CartsModule } from './carts/carts.module';
import { CoinsModule } from './coins/coins.module';

@Module({
  imports: [
    BannersModule,
    RouterModule.register([
      { path: 'client', module: BannersModule },
      { path: 'client', module: StoresModule },
      { path: 'client', module: AuthModule },
      { path: 'client', module: AddressesModule },
      { path: 'client', module: OrdersModule },
      { path: 'client', module: CancelOrderReasonsModule },
      { path: 'client', module: ReviewTemplatesModule },
      { path: 'client', module: ReviewsModule },
      { path: 'client', module: NotificationsModule },
      { path: 'client', module: CoinsModule },
    ]),
    AuthModule,
    TypeOrmModule.forFeature([ClientEntity]),
    StoresModule,
    ProductsModule,
    ProductCategoriesModule,
    AddressesModule,
    CartsModule,
    OrdersModule,
    CancelOrderReasonsModule,
    ReviewTemplatesModule,
    ReviewsModule,
    NotificationsModule,
    CoinsModule,
  ],
  exports: [],
})
export class ClientModule {}
