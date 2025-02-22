import { StoreAvailableView } from './../../../database/views/store-available.view';
import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';
import { TIMEZONE } from 'src/common/constants';
import * as moment from 'moment-timezone';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(StoreLikeEntity)
    private storeLikeRepository: Repository<StoreLikeEntity>,

    @InjectRepository(ClientReviewStoreEntity)
    private reviewStoreRepository: Repository<ClientReviewStoreEntity>,

    @InjectRepository(StoreAvailableView)
    private storeAvailableViewRepository: Repository<StoreAvailableView>,
  ) {}

  createQueryBuilder(alias: string) {
    return this.storeRepository.createQueryBuilder(alias);
  }

  async likeStore(storeId: number, clientId: number) {
    return this.storeLikeRepository.upsert({ storeId, clientId }, ['storeId', 'clientId']);
  }

  async unlikeStore(storeId: number, clientId: number) {
    return this.storeLikeRepository.delete({ storeId, clientId });
  }

  createReviewStoreQueryBuilder(alias: string) {
    return this.reviewStoreRepository.createQueryBuilder(alias);
  }

  createAvailableStoreQueryBuilder(alias: string) {
    return this.storeAvailableViewRepository.createQueryBuilder(alias);
  }

  // check xem quán có đang hoạt động không
  async checkStoreAvailable(storeId: number) {
    return this.storeRepository
      .createQueryBuilder('store')
      .where('store.id = :storeId', { storeId })
      .andWhere('store.status = :status', { status: 'active' })
      .andWhere('store.isPause = false')
      .innerJoin(
        'store.workingTimes',
        'workingTime',
        `workingTime.dayOfWeek = EXTRACT(DOW FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) 
        AND workingTime.openTime <= EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) * 60 + EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) 
        AND workingTime.closeTime >= EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) * 60 + EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh'))`,
      )
      .leftJoin(
        'store.specialWorkingTimes',
        'specialWorkingTime',
        `specialWorkingTime.date = CURRENT_DATE AT TIME ZONE 'Asia/Ho_Chi_Minh' 
        AND specialWorkingTime.startTime <= EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) * 60 + EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) 
        AND specialWorkingTime.endTime >= EXTRACT(HOUR FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) * 60 + EXTRACT(MINUTE FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')) 
        AND specialWorkingTime.isOpen = false`,
      )
      .andWhere('specialWorkingTime.id IS NULL')
      .getExists();
  }
}
