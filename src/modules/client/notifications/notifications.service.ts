import { Injectable } from '@nestjs/common';
import { ClientNotificationEntity } from 'src/database/entities/client-notification.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmService } from 'src/modules/fcm/fcm.service';
import { ClientService } from '../clients/client.service';
import { EClientNotificationStatus } from 'src/common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(ClientNotificationEntity)
    private readonly notificationRepository: Repository<ClientNotificationEntity>,

    private readonly fcmService: FcmService,
    private readonly clientService: ClientService,
  ) {}

  async save(entity: ClientNotificationEntity) {
    const { clientId, title, content, from, type, relatedId, status = EClientNotificationStatus.Info } = entity;
    const client = await this.clientService.findOne({ select: ['id', 'deviceToken'], where: { id: clientId } });

    if (client && client.deviceToken) {
      this.fcmService.sendToDevice(client.deviceToken, '', '', {
        type,
        orderId: relatedId.toString(),
        status,
        title,
        content: content.replace('{{from}}', from),
      });
    }

    return this.notificationRepository.save(entity);
  }

  async update(criteria: FindOptionsWhere<ClientNotificationEntity>, data: Partial<ClientNotificationEntity>) {
    return this.notificationRepository.update(criteria, data);
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
