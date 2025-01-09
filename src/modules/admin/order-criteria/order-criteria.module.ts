import { Module } from '@nestjs/common';
import { OrderCriteriaService } from './order-criteria.service';
import { OrderCriteriaController } from './order-criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCriteriaEntity])],
  controllers: [OrderCriteriaController],
  providers: [OrderCriteriaService],
})
export class OrderCriteriaModule {}
