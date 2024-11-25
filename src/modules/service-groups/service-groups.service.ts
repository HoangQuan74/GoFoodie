import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ServiceGroupsService {
  constructor(
    @InjectRepository(ServiceGroupEntity)
    private readonly serviceGroupRepository: Repository<ServiceGroupEntity>,
  ) {}

  async find(options?: FindManyOptions<ServiceGroupEntity>): Promise<ServiceGroupEntity[]> {
    return this.serviceGroupRepository.find(options);
  }
}
