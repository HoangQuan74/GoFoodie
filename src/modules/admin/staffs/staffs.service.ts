import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StaffsService {
  constructor(
    @InjectRepository(MerchantEntity)
    private readonly staffRepository: Repository<MerchantEntity>,
  ) {}

  async find(options: FindManyOptions<MerchantEntity> = {}): Promise<MerchantEntity[]> {
    return this.staffRepository.find(options);
  }

  async save(staff: Partial<MerchantEntity>): Promise<MerchantEntity> {
    return this.staffRepository.save(staff);
  }

  async findOne(options: FindManyOptions<MerchantEntity>): Promise<MerchantEntity> {
    return this.staffRepository.findOne(options);
  }

  async remove(entity: MerchantEntity): Promise<MerchantEntity> {
    return this.staffRepository.remove(entity);
  }
}
