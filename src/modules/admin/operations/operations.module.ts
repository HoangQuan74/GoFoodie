import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationEntity } from 'src/database/entities/operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OperationEntity])],
  controllers: [OperationsController],
  providers: [OperationsService],
})
export class OperationsModule {}
