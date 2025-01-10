import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class StoreAddressesService {
  constructor(
    @InjectRepository(StoreAddressEntity)
    private readonly storeAddressRepository: Repository<StoreAddressEntity>,
  ) {}

  async save(entity: Partial<StoreAddressEntity>) {
    return this.storeAddressRepository.save(entity);
  }

  async find(options?: FindManyOptions<StoreAddressEntity>) {
    return this.storeAddressRepository.find(options);
  }

  async findOne(options: FindOneOptions<StoreAddressEntity>) {
    return this.storeAddressRepository.findOne(options);
  }
}
