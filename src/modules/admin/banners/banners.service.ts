import { Injectable } from '@nestjs/common';
import { BannerEntity } from 'src/database/entities/banner.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BannerTypeEntity } from 'src/database/entities/banner-type.entity';
import { BannerPositionEntity } from 'src/database/entities/banner-position.entity';
import { BannerChangeTypeEntity } from 'src/database/entities/banner-change-type.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,

    @InjectRepository(BannerTypeEntity)
    private readonly bannerTypeRepository: Repository<BannerTypeEntity>,

    @InjectRepository(BannerPositionEntity)
    private readonly bannerPositionRepository: Repository<BannerPositionEntity>,

    @InjectRepository(BannerChangeTypeEntity)
    private readonly bannerChangeTypeRepository: Repository<BannerChangeTypeEntity>,
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

  createQueryBuilder(alias?: string) {
    return this.bannerRepository.createQueryBuilder(alias);
  }

  async getTypes() {
    return this.bannerTypeRepository.find();
  }

  async getPositions(appType: string, type: string) {
    return this.bannerPositionRepository.find({
      where: { appTypes: { value: appType }, bannerTypes: { value: type } },
    });
  }

  async getChangeTypes() {
    return this.bannerChangeTypeRepository.find();
  }
}
