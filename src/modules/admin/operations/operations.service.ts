import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OperationEntity } from 'src/database/entities/operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(OperationEntity)
    private operationRepository: Repository<OperationEntity>,
  ) {}

  async find(options?: FindManyOptions<OperationEntity>) {
    return this.operationRepository.find(options);
  }

  async findOne(options: FindOneOptions<OperationEntity>) {
    return this.operationRepository.findOne(options);
  }

  async save(entity: Partial<OperationEntity>) {
    return this.operationRepository.save(entity);
  }

  async remove(entity: OperationEntity) {
    return this.operationRepository.remove(entity);
  }
}
