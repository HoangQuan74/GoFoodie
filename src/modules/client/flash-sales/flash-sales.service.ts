import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FlashSaleEntity } from 'src/database/entities/flash-sale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FlashSalesService {
  constructor(
    @InjectRepository(FlashSaleEntity)
    private readonly flashSaleRepository: Repository<FlashSaleEntity>,
  ) {}

  createQueryBuilder(alias?: string) {
    return this.flashSaleRepository.createQueryBuilder(alias);
  }
}
