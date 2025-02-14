import { StoreAvailableView } from './../../../database/views/store-available.view';
import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';
import { ClientReviewStoreEntity } from 'src/database/entities/client-review-store.entity';

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
}
