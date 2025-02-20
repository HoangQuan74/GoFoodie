import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';
import { OrderCriteriaEntity } from 'src/database/entities/order-criteria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderCriteriaService {
  constructor(
    @InjectRepository(OrderCriteriaEntity)
    private readonly orderCriteriaRepository: Repository<OrderCriteriaEntity>,
  ) {
    this.getDistanceScanDriver();
  }

  /**
   * Get distance scan driver (m)
   */
  async getDistanceScanDriver() {
    const orderCriteria = await this.orderCriteriaRepository.findOne({ where: { type: EOrderCriteriaType.Distance } });
    if (!orderCriteria) return 1000;

    return orderCriteria.value;
  }
}
