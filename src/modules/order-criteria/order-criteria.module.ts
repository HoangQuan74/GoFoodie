import { Module } from '@nestjs/common';
import { OrderCriteriaService } from './order-criteria.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCriteriaEntity])],
  controllers: [],
  providers: [OrderCriteriaService],
  exports: [OrderCriteriaService],
})
export class OrderCriteriaModule {}
