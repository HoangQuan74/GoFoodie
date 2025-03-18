import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreNotificationEntity } from 'src/database/entities/store-notification.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(StoreNotificationEntity)
    private notificationRepository: Repository<StoreNotificationEntity>,
  ) {}

  createQueryBuilder(alias?: string) {
    return this.notificationRepository.createQueryBuilder(alias);
  }

  findOne(options: FindOneOptions<StoreNotificationEntity>) {
    return this.notificationRepository.findOne(options);
  }

  save(entity: StoreNotificationEntity) {
    return this.notificationRepository.save(entity);
  }

  update(criteria: FindOptionsWhere<StoreNotificationEntity>, data: Partial<StoreNotificationEntity>) {
    return this.notificationRepository.update(criteria, data);
  }
}
