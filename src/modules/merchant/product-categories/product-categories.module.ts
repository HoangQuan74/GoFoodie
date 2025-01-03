import { forwardRef, Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCategoriesController } from './product-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { MerchantModule } from '../merchant.module';
import { StoresModule } from '../stores/stores.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductCategoryEntity]),
    forwardRef(() => MerchantModule),
    StoresModule,
    ProductsModule,
  ],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService],
})
export class ProductCategoriesModule {}
