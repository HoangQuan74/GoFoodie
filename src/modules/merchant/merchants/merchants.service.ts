import { Injectable } from '@nestjs/common';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantsRepository: Repository<MerchantEntity>,
  ) {}

  async find(options: FindManyOptions<MerchantEntity>) {
    return this.merchantsRepository.find(options);
  }

  async findOne(options: FindOneOptions<MerchantEntity>) {
    return this.merchantsRepository.findOne(options);
  }
}
