import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminNotificationEntity } from 'src/database/entities/admin-notification.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminNotificationEntity]), forwardRef(() => AdminsModule)],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
