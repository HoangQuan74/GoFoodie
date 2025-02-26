import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { ClientModule } from '../client.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientNotificationEntity]), forwardRef(() => ClientModule)],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
