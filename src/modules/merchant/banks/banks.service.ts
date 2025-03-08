import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreBankEntity } from 'src/database/entities/store-bank.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(StoreBankEntity)
    private readonly bankRepository: Repository<StoreBankEntity>,
  ) {}

  async find(options?: FindManyOptions<StoreBankEntity>) {
    return this.bankRepository.find(options);
  }
}
