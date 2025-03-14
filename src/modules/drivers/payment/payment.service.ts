import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ETransactionType } from 'src/common/enums';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor() {}
}
