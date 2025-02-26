import { Injectable } from '@nestjs/common';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ClientNotificationEntity)
    private readonly notificationRepository: Repository<ClientNotificationEntity>,
  ) {}

  async save(entity: ClientNotificationEntity) {
    return this.notificationRepository.save(entity);
  }

  async find(options?: FindManyOptions<ClientNotificationEntity>) {
    return this.notificationRepository.find(options);
  }

  async findOne(options: FindOneOptions<ClientNotificationEntity>) {
    return this.notificationRepository.findOne(options);
  }

  createQueryBuilder(alias?: string) {
    return this.notificationRepository.createQueryBuilder(alias);
  }
}
