import { Injectable } from '@nestjs/common';
import { StoreEntity } from 'src/database/entities/store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';
import { EStoreAddressType } from 'src/common/enums';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,

    @InjectRepository(StoreAddressEntity)
    private readonly storeAddressRepository: Repository<StoreAddressEntity>,
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

  async initStoreAddress(storeId: number, address: string, lat: number, lng: number) {
    const addresses = Object.values(EStoreAddressType).map((type) => {
      const storeAddress = new StoreAddressEntity();
      storeAddress.storeId = storeId;
      storeAddress.address = address;
      storeAddress.lat = lat;
      storeAddress.lng = lng;
      storeAddress.type = type;
      return storeAddress;
    });

    return this.storeAddressRepository.save(addresses);
  }
}
