import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverTransactionHistoryEntity } from 'src/database/entities/driver-transaction-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(DriverTransactionHistoryEntity)
    private transactionHistoryRepository: Repository<DriverTransactionHistoryEntity>,
  ) {}

  createQueryBuilder(alias: string) {
    return this.transactionHistoryRepository.createQueryBuilder(alias);
  }
}
