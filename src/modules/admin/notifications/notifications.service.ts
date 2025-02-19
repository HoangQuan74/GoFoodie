import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminNotificationEntity } from 'src/database/entities/admin-notification.entity';
import { EventGatewayService } from 'src/events/event.gateway.service';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(AdminNotificationEntity)
    private notificationRepository: Repository<AdminNotificationEntity>,

    private readonly eventGatewayService: EventGatewayService,
  ) {}

  async save(entity: DeepPartial<AdminNotificationEntity>) {
    this.eventGatewayService.handleNewNotification();
    return this.notificationRepository.save(entity);
  }

  createQueryBuilder(alias?: string) {
    return this.notificationRepository.createQueryBuilder(alias);
  }
}
