import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { DriverRequestEntity } from 'src/database/entities/driver-request.entity';
import { AdminsModule } from '../admins/admins.module';
import { MerchantRequestEntity } from 'src/database/entities/merchant-request.entity';
import { RequestTypeEntity } from 'src/database/entities/request-type.entity';
import { ProductsModule } from '../products/products.module';
import { NotificationsModule } from 'src/modules/merchant/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductApprovalEntity, DriverRequestEntity, MerchantRequestEntity, RequestTypeEntity]),
    AdminsModule,
    ProductsModule,
    NotificationsModule,
  ],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
