import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigEntity } from 'src/database/entities/config.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectRepository(ConfigEntity)
    private readonly configRepository: Repository<ConfigEntity>,
  ) {}

  find(options?: FindManyOptions<ConfigEntity>) {
    return this.configRepository.find(options);
  }
}
