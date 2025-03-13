import { Module } from '@nestjs/common';
import { FeeService } from './fee.service';
import { FeeController } from './fee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeEntity } from 'src/database/entities/fee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeeEntity])],
  controllers: [FeeController],
  providers: [FeeService],
  exports: [FeeService],
})
export class FeeModule {}
