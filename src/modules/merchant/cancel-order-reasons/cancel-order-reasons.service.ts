import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CancelOrderReasonEntity } from 'src/database/entities/cancel-order-reason.entity';

@Injectable()
export class CancelOrderReasonsService {
  constructor(
    @InjectRepository(CancelOrderReasonEntity)
    private cancelOrderReasonRepository: Repository<CancelOrderReasonEntity>,
  ) {}

  async find(options: FindManyOptions<CancelOrderReasonEntity>) {
    return this.cancelOrderReasonRepository.find(options);
  }
}
