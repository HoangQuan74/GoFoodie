import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorePreparationTimeEntity } from 'src/database/entities/store-preparation-time.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class PreparationTimesService {
  constructor(
    @InjectRepository(StorePreparationTimeEntity)
    private preparationTimeRepository: Repository<StorePreparationTimeEntity>,
  ) {}

  async save(storeId: number, entities: Partial<StorePreparationTimeEntity>[]) {
    return this.preparationTimeRepository.save(entities.map((entity) => ({ ...entity, storeId })));
  }

  async delete(where: FindOptionsWhere<StorePreparationTimeEntity>) {
    return this.preparationTimeRepository.delete(where);
  }
}
