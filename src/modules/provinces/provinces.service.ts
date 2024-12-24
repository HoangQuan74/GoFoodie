import { Injectable } from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinceEntity } from 'src/database/entities/province.entity';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(ProvinceEntity)
    private readonly provinceRepository: Repository<ProvinceEntity>,
  ) {}

  async find(options?: FindManyOptions<ProvinceEntity>): Promise<ProvinceEntity[]> {
    return this.provinceRepository.find(options);
  }

  async findAndCount(options?: FindManyOptions<ProvinceEntity>): Promise<[ProvinceEntity[], number]> {
    return this.provinceRepository.findAndCount(options);
  }

  createQueryBuilder(alias: string) {
    return this.provinceRepository.createQueryBuilder(alias);
  }
}
