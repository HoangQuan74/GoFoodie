import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreEntity } from 'src/database/entities/store.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private storeRepository: Repository<StoreEntity>,
  ) {}

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
}
