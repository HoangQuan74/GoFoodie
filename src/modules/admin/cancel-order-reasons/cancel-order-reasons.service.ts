import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CancelOrderReasonEntity } from 'src/database/entities/cancel-order-reason.entity';
import { DeepPartial, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CancelOrderReasonsService {
  constructor(
    @InjectRepository(CancelOrderReasonEntity)
    private readonly cancelOrderReasonRepository: Repository<CancelOrderReasonEntity>,
  ) {}

  createQueryBuilder(alias?: string) {
    return this.cancelOrderReasonRepository.createQueryBuilder(alias);
  }

  async save(entities: DeepPartial<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.save(entities);
  }

  async find(options?: FindManyOptions<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.find(options);
  }

  async findOne(options: FindManyOptions<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.findAndCount(options);
  }

  async delete(criteria: FindOptionsWhere<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.delete(criteria);
  }
}
