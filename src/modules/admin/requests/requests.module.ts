import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { AdminsModule } from '../admins/admins.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductApprovalEntity, DriverRequestEntity]), AdminsModule, ProductsModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
