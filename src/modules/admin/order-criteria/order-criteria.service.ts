import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class OrderCriteriaService {
  constructor(
    @InjectRepository(OrderCriteriaEntity)
    private readonly orderCriteriaRepository: Repository<OrderCriteriaEntity>,
  ) {}

  createQueryBuilder(alias?: string) {
    return this.orderCriteriaRepository.createQueryBuilder(alias);
  }

  // save many
  async save(entity: Partial<OrderCriteriaEntity>[]) {
    return this.orderCriteriaRepository.save(entity);
  }

  async find(options?: FindManyOptions<OrderCriteriaEntity>) {
    return this.orderCriteriaRepository.find(options);
  }

  async delete(criteria: FindOptionsWhere<OrderCriteriaEntity>) {
    return this.orderCriteriaRepository.delete(criteria);
  }
}
