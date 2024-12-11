import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MerchantsModule } from '../merchants/merchants.module';

@Module({
  imports: [MerchantsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
