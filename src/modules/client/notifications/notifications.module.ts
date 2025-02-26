import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { ClientModule } from '../clients/client.module';
import { FcmModule } from 'src/modules/fcm/fcm.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientNotificationEntity]), forwardRef(() => ClientModule), FcmModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
