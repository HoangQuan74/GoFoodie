import { Injectable } from '@nestjs/common';
import { TitleConfigEntity } from 'src/database/entities/title-config.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class DriverTitleConfigsService {
  constructor(
    @InjectRepository(TitleConfigEntity)
    private readonly driverTitleConfigRepository: Repository<TitleConfigEntity>,
  ) {}

  async create(data: DeepPartial<TitleConfigEntity>): Promise<TitleConfigEntity> {
    let driverTitleConfig = await this.driverTitleConfigRepository.findOne({ where: {}, relations: ['driverTitles'] });
    if (!driverTitleConfig) driverTitleConfig = new TitleConfigEntity();
    this.driverTitleConfigRepository.merge(driverTitleConfig, data);
    return this.driverTitleConfigRepository.save(driverTitleConfig);
  }

  async findOne(options: FindOneOptions<TitleConfigEntity>): Promise<TitleConfigEntity> {
    return this.driverTitleConfigRepository.findOne(options);
  }
}
