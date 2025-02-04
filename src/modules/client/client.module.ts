import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BannersModule } from './banners/banners.module';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from 'src/database/entities/client.entity';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { AddressesModule } from './addresses/addresses.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './order/order.module';
import { CancelOrderReasonsModule } from './cancel-order-reasons/cancel-order-reasons.module';
import { ReviewTemplatesModule } from './review-templates/review-templates.module';

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
  ],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
