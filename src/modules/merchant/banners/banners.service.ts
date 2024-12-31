import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerEntity } from 'src/database/entities/banner.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {}

  async findOne(options: FindOneOptions<BannerEntity>): Promise<BannerEntity> {
    return this.bannerRepository.findOne(options);
  }

  createQueryBuilder(alias: string) {
    return this.bannerRepository.createQueryBuilder(alias);
  }
}
