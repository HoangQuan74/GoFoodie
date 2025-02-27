import { Injectable } from '@nestjs/common';
import { ConfigTimeEntity } from 'src/database/entities/config-time.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ConfigTimesService {
  constructor(
    @InjectRepository(ConfigTimeEntity)
    private configTimeRepository: Repository<ConfigTimeEntity>,
  ) {}

  async save(entity: Partial<ConfigTimeEntity>) {
    return this.configTimeRepository.save(entity);
  }

  async find(options?: FindManyOptions<ConfigTimeEntity>) {
    return this.configTimeRepository.find(options);
  }
}
