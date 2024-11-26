import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MerchantView } from 'src/database/views/merchant.view';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private merchantRepository: Repository<MerchantEntity>,

    @InjectRepository(MerchantView)
    private merchantViewRepository: Repository<MerchantView>,
  ) {}

  async save(entity: Partial<MerchantEntity>): Promise<MerchantEntity> {
    return this.merchantRepository.save(entity);
  }

  async find(options: FindManyOptions<MerchantEntity>): Promise<MerchantEntity[]> {
    return this.merchantRepository.find(options);
  }

  async findOne(options: FindOneOptions<MerchantEntity>): Promise<MerchantEntity> {
    return this.merchantRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<MerchantView>): Promise<[MerchantView[], number]> {
    return this.merchantViewRepository.findAndCount(options);
  }

  createQueryBuilder(alias?: string) {
    return this.merchantRepository.createQueryBuilder(alias);
  }

  createViewBuilder(alias?: string) {
    return this.merchantViewRepository.createQueryBuilder(alias);
  }

  async count(options: FindManyOptions<MerchantEntity>): Promise<number> {
    return this.merchantRepository.count(options);
  }

  remove(entity: MerchantEntity | MerchantEntity[]): Promise<MerchantEntity | MerchantEntity[]> {
    if (Array.isArray(entity)) {
      return this.merchantRepository.softRemove(entity);
    }
    return this.merchantRepository.softRemove(entity);
  }
}
