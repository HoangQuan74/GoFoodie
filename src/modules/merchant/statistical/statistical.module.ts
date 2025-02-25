import { forwardRef, Module } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { StatisticalController } from './statistical.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantModule } from '../merchant.module';
import { ProductEntity } from 'src/database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity]), forwardRef(() => MerchantModule)],
  controllers: [StatisticalController],
  providers: [StatisticalService],
  exports: [StatisticalService],
})
export class StatisticalModule {}
