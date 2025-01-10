import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreLikeEntity } from 'src/database/entities/store-like.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,

    @InjectRepository(StoreLikeEntity)
    private storeLikeRepository: Repository<StoreLikeEntity>,
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
}
