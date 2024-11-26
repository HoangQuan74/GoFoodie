import { BankEntity } from 'src/database/entities/bank.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
  ) {}

  async find(options?: FindManyOptions<BankEntity>): Promise<BankEntity[]> {
    return this.bankRepository.find(options);
  }
}
