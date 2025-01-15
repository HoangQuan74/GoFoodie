import { forwardRef, Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/database/entities/cart.entity';
import { ProductsModule } from '../products/products.module';
import { ClientModule } from '../client.module';
import { CartProductEntity } from 'src/database/entities/cart-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartProductEntity]), ProductsModule, forwardRef(() => ClientModule)],
  controllers: [CartsController],
  providers: [CartsService],
})
export class CartsModule {}
