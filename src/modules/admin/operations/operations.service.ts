import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
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
}
