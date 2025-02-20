import { Injectable } from '@nestjs/common';
import { TitleConfigEntity } from 'src/database/entities/title-config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { TitlePolicySanctionEntity } from 'src/database/entities/title-policy-sanction.entity';
import { TitlePolicyCriteriaEntity } from 'src/database/entities/title-policy-criteria.entity';

@Injectable()
export class DriverTitleConfigsService {
  constructor(
    @InjectRepository(TitleConfigEntity)
    private readonly driverTitleConfigRepository: Repository<TitleConfigEntity>,

    @InjectRepository(TitlePolicyCriteriaEntity)
    private readonly titlePolicyCriteriaRepository: Repository<TitlePolicyCriteriaEntity>,

    @InjectRepository(TitlePolicySanctionEntity)
    private readonly titlePolicySanctionRepository: Repository<TitlePolicySanctionEntity>,
  ) {}

  async create(data: DeepPartial<TitleConfigEntity>): Promise<TitleConfigEntity> {
    let driverTitleConfig = await this.driverTitleConfigRepository.findOne({ where: {} });
    if (!driverTitleConfig) driverTitleConfig = new TitleConfigEntity();
    this.driverTitleConfigRepository.merge(driverTitleConfig, data);
    return this.driverTitleConfigRepository.save(driverTitleConfig);
  }

  async findOne(options: FindOneOptions<TitleConfigEntity>): Promise<TitleConfigEntity> {
    return this.driverTitleConfigRepository.findOne(options);
  }

  async findCriteria(options?: FindOneOptions<TitlePolicyCriteriaEntity>): Promise<TitlePolicyCriteriaEntity[]> {
    return this.titlePolicyCriteriaRepository.find(options);
  }

  async findSanctions(options?: FindOneOptions<TitlePolicySanctionEntity>): Promise<TitlePolicySanctionEntity[]> {
    return this.titlePolicySanctionRepository.find(options);
  }
}
