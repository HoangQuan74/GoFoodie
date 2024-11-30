import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async save(entity?: Partial<StoreEntity>) {
    return this.storeRepository.save(entity);
  }

  async findOne(options: FindOneOptions<StoreEntity>) {
    return this.storeRepository.findOne(options);
  }

  async find(options?: FindManyOptions<StoreEntity>): Promise<StoreEntity[]> {
    return this.storeRepository.find(options);
  }

  async count(options?: FindManyOptions<StoreEntity>) {
    return this.storeRepository.count(options);
  }

  createQueryBuilder(alias: string) {
    return this.storeRepository.createQueryBuilder(alias);
  }

  merge(entity: StoreEntity, body: any) {
    return this.storeRepository.merge(entity, body);
  }

  async remove(entity: StoreEntity | StoreEntity[]) {
    if (Array.isArray(entity)) {
      return this.storeRepository.remove(entity);
    }
    return this.storeRepository.remove([entity]);
  }
}
