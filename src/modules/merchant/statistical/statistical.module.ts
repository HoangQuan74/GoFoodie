import { forwardRef, Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { ProductEntity } from 'src/database/entities/product.entity';
import { StoreEntity } from 'src/database/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity, StoreEntity]), forwardRef(() => MerchantModule)],
  controllers: [StatisticalController],
  providers: [StatisticalService],
  exports: [StatisticalService],
})
export class StatisticalModule {}
