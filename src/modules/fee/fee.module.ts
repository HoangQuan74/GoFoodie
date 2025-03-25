import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { AppFeeEntity } from 'src/database/entities/app-fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeeEntity, AppFeeEntity])],
  controllers: [FeeController],
  providers: [FeeService],
  exports: [FeeService],
})
export class FeeModule {}
