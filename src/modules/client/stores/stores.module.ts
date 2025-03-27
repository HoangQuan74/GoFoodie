import { forwardRef, Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from 'src/database/entities/store.entity';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ProductCategoriesModule } from '../product-categories/product-categories.module';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { ClientModule } from '../clients/client.module';
import { StoreView } from 'src/database/views/store.view';
import { VouchersModule } from '../vouchers/vouchers.module';
import { ProductsModule } from '../products/products.module';
import { FlashSalesModule } from '../flash-sales/flash-sales.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreEntity, StoreLikeEntity, ClientReviewStoreEntity, StoreView]),
    ProductCategoriesModule,
    forwardRef(() => ClientModule),
    VouchersModule,
    ProductsModule,
    FlashSalesModule,
  ],
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
