import { forwardRef, Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';
import { ClientModule } from '../client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, StoreLikeEntity]),
    ProductCategoriesModule,
    forwardRef(() => ClientModule),
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
