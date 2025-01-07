import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeeTypeEntity } from 'src/database/entities/fee-type.entity';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class FeesService {
  constructor(
    @InjectRepository(FeeEntity)
    private readonly feeRepository: Repository<FeeEntity>,

    @InjectRepository(FeeTypeEntity)
    private readonly feeTypeRepository: Repository<FeeTypeEntity>,
  ) {}

  async save(entity: DeepPartial<FeeEntity>): Promise<FeeEntity> {
    return this.feeRepository.save(entity);
  }

  async find(options?: FindManyOptions<FeeEntity>): Promise<FeeEntity[]> {
    return this.feeRepository.find(options);
  }

  async findOne(options: FindOneOptions<FeeEntity>): Promise<FeeEntity> {
    return this.feeRepository.findOne(options);
  }

  createQueryBuilder(alias: string) {
    return this.feeRepository.createQueryBuilder(alias);
  }

  async remove(entity: FeeEntity) {
    return this.feeRepository.softRemove(entity);
  }

  async getTypes() {
    return this.feeTypeRepository.find();
  }
}
