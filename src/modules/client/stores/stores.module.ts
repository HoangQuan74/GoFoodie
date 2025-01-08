import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity]), ProductCategoriesModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
