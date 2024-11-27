import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WardEntity } from 'src/database/entities/ward.entity';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(WardEntity)
    private readonly wardRepository: Repository<WardEntity>,
  ) {}

  async find(options?: FindManyOptions<WardEntity>): Promise<WardEntity[]> {
    return this.wardRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<WardEntity>): Promise<[WardEntity[], number]> {
    return this.wardRepository.findAndCount(options);
  }

  async getProvinceIdAndDistrictId(wardId: number): Promise<{ provinceId: number; districtId: number }> {
    const ward = await this.wardRepository.findOne({
      select: { id: true, districtId: true, district: { provinceId: true } },
      where: { id: wardId },
      relations: ['district'],
    });

    return { provinceId: ward?.district?.provinceId, districtId: ward?.districtId };
  }
}
