import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MerchantModule } from '../merchants/merchant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { OptionGroupsModule } from '../option-groups/option-groups.module';
import { ProductApprovalEntity } from 'src/database/entities/product-approval.entity';
import { NotificationsModule } from 'src/modules/admin/notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    forwardRef(() => MerchantModule),
    TypeOrmModule.forFeature([ProductEntity, ProductApprovalEntity]),
    OptionGroupsModule,
    NotificationsModule,
    EventsModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
