import { forwardRef, Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { ProductsModule } from '../products/products.module';
import { ClientModule } from '../clients/client.module';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';
import { OrdersModule } from '../order/order.module';
import { StoresModule } from '../stores/stores.module';
import { AppFeeEntity } from 'src/database/entities/app-fee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartProductEntity, AppFeeEntity]),
    ProductsModule,
    forwardRef(() => ClientModule),
    OrdersModule,
    StoresModule,
  ],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
