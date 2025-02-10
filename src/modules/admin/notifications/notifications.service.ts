import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminNotificationEntity } from 'src/database/entities/admin-notification.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(AdminNotificationEntity)
    private notificationRepository: Repository<AdminNotificationEntity>,
  ) {}

  async save(entity: DeepPartial<AdminNotificationEntity>) {
    return this.notificationRepository.save(entity);
  }

  createQueryBuilder(alias?: string) {
    return this.notificationRepository.createQueryBuilder(alias);
  }
}
