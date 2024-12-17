import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductApprovalEntity]), AdminsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
