import { Injectable } from '@nestjs/common';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { ClientService } from '../clients/client.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ClientNotificationEntity)
    private readonly notificationRepository: Repository<ClientNotificationEntity>,

    private readonly fcmService: FcmService,
    private readonly clientService: ClientService,
  ) {}

  async save(entity: ClientNotificationEntity) {
    const { clientId, title, content, from, type, relatedId } = entity;
    const client = await this.clientService.findOne({ select: ['id', 'deviceToken'], where: { id: clientId } });

    if (client && client.deviceToken) {
      const body = content.replace('{{from}}', from);
      this.fcmService.sendToDevice(client.deviceToken, title, body, { type, orderId: relatedId.toString() });
    }
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
