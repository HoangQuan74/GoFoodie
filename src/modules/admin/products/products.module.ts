import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { StoresModule } from '../stores/stores.module';
import { OptionGroupsModule } from '../option-groups/option-groups.module';
import { AdminsModule } from '../admins/admins.module';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    StoresModule,
    OptionGroupsModule,
    AdminsModule,
    ProductCategoriesModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
