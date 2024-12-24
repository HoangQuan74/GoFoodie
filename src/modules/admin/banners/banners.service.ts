import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { BannerEntity } from 'src/database/entities/banner.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {}

  async save(entity: DeepPartial<BannerEntity>) {
    return this.bannerRepository.save(entity);
  }

  async find(options?: FindManyOptions<BannerEntity>) {
    return this.bannerRepository.find(options);
  }

  async findOne(options: FindOneOptions<BannerEntity>) {
    return this.bannerRepository.findOne(options);
  }

  async remove(entity: BannerEntity) {
    return this.bannerRepository.softRemove(entity);
  }
}
