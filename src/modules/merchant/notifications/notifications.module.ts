import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreNotificationEntity } from 'src/database/entities/store-notification.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { FcmModule } from 'src/modules/fcm/fcm.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreNotificationEntity]), MerchantModule, FcmModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
