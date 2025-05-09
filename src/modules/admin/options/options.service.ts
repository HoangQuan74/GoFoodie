import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppTypeEntity } from 'src/database/entities/app-type.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(AppTypeEntity)
    private readonly appTypeRepository: Repository<AppTypeEntity>,
  ) {}

  async getAppTypes(options?: FindManyOptions<AppTypeEntity>): Promise<AppTypeEntity[]> {
    return this.appTypeRepository.find(options);
  }
}
