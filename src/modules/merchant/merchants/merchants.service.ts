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

  async save(merchant: MerchantEntity) {
    return this.merchantsRepository.save(merchant);
  }

  async find(options: FindManyOptions<MerchantEntity>) {
    return this.merchantsRepository.find(options);
  }

  async findOne(options: FindOneOptions<MerchantEntity>) {
    return this.merchantsRepository.findOne(options);
  }

  createQueryBuilder(alias: string) {
    return this.merchantsRepository.createQueryBuilder(alias);
  }
}
