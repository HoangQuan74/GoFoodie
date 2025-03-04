import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
  ) {}

  async save(store: DeepPartial<StoreEntity>) {
    return this.storeRepository.save(store);
  }

  async find(options?: FindManyOptions<StoreEntity>) {
    return this.storeRepository.find(options);
  }

  async findOne(options: FindOneOptions<StoreEntity>) {
    return this.storeRepository.findOne(options);
  }

  async findAndCount(options?: FindManyOptions<StoreEntity>) {
    return this.storeRepository.findAndCount(options);
  }

  async remove(entity: StoreEntity) {
    return this.storeRepository.remove(entity);
  }

  createQueryBuilder(alias: string) {
    return this.storeRepository.createQueryBuilder(alias);
  }

  merge(entity: StoreEntity, data: any) {
    return this.storeRepository.merge(entity, data);
  }

  async getBalance(storeId: number) {
    const store = await this.findOne({ where: { id: storeId } });
    return Number(store.balance);
  }
}
