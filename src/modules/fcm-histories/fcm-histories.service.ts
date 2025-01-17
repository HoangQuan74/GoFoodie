import { Injectable } from '@nestjs/common';
import { FindManyOptions, IsNull, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmHistoryEntity } from 'src/database/entities/fcm-history.entity';
import { FcmService } from '../fcm/fcm.service';

@Injectable()
export class FcmHistoriesService {
  private readonly chunkSize: number = 100;

  constructor(
    @InjectRepository(FcmHistoryEntity)
    private readonly fcmHistoryRepository: Repository<FcmHistoryEntity>,

    private readonly fcmService: FcmService,
  ) {}

  async save(entity: Partial<FcmHistoryEntity>): Promise<FcmHistoryEntity> {
    return this.fcmHistoryRepository.save(entity);
  }

  async find(options: FindManyOptions<FcmHistoryEntity>): Promise<FcmHistoryEntity[]> {
    return this.fcmHistoryRepository.find(options);
  }

  async count(options: FindManyOptions<FcmHistoryEntity>): Promise<number> {
    return this.fcmHistoryRepository.count(options);
  }

  async send(): Promise<void> {
    const now = new Date();
    const count = await this.fcmHistoryRepository.count({ where: { sentAt: LessThan(now), isSuccess: IsNull() } });
    if (count === 0) return;

    const pages = Math.ceil(count / this.chunkSize);
    for (let i = 0; i < pages; i++) {
      const fcmHistories = await this.fcmHistoryRepository
        .createQueryBuilder('fcmHistory')
        .addSelect(['client.id', 'client.deviceToken'])
        .addSelect(['merchant.id', 'merchant.deviceToken'])
        .addSelect(['driver.id', 'driver.deviceToken'])
        .leftJoin('fcmHistory.client', 'client', 'fcmHistory.userType = :userType', { userType: 'client' })
        .leftJoin('fcmHistory.merchant', 'merchant', 'fcmHistory.userType = :userType', { userType: 'merchant' })
        .leftJoin('fcmHistory.driver', 'driver', 'fcmHistory.userType = :userType', { userType: 'driver' })
        .where('fcmHistory.isSuccess IS NULL')
        .andWhere('fcmHistory.sentAt < :sentAt', { sentAt: new Date() })
        .take(this.chunkSize)
        .skip(i * this.chunkSize)
        .getMany();

      for (const fcmHistory of fcmHistories) {
        try {
          const { title, body, client, merchant, driver } = fcmHistory;
          const deviceTokens = [client?.deviceToken, merchant?.deviceToken, driver?.deviceToken].filter(Boolean);
          if (deviceTokens.length === 0) continue;

          await this.fcmService.sendToDevice(deviceTokens[0], title, body);
          fcmHistory.isSuccess = true;
          fcmHistory.sentAt = new Date();
          await this.fcmHistoryRepository.save(fcmHistory);
        } catch (error) {
          fcmHistory.sentAt = new Date();
          fcmHistory.isSuccess = false;
          await this.fcmHistoryRepository.save(fcmHistory);
          console.error(error);
        }
      }
    }
  }
}
