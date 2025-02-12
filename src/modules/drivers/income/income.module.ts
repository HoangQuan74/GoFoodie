import { forwardRef, Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { DriversModule } from '../drivers.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), forwardRef(() => DriversModule)],
  controllers: [IncomeController],
  providers: [IncomeService],
  exports: [IncomeService],
})
export class IncomeModule { }
