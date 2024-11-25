import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DistrictEntity } from 'src/database/entities/district.entity';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(DistrictEntity)
    private readonly districtRepository: Repository<DistrictEntity>,
  ) {}

  async find(options?: FindManyOptions<DistrictEntity>): Promise<DistrictEntity[]> {
    return this.districtRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<DistrictEntity>): Promise<[DistrictEntity[], number]> {
    return this.districtRepository.findAndCount(options);
  }
}
