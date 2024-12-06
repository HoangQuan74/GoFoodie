import { Injectable } from '@nestjs/common';
import { ServiceGroupEntity } from 'src/database/entities/service-group.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ServiceGroupsService {
  constructor(
    @InjectRepository(ServiceGroupEntity)
    private readonly serviceGroupRepository: Repository<ServiceGroupEntity>,
  ) {}

  save(entity: Partial<ServiceGroupEntity>): Promise<ServiceGroupEntity> {
    return this.serviceGroupRepository.save(entity);
  }

  find(options?: FindManyOptions<ServiceGroupEntity>): Promise<ServiceGroupEntity[]> {
    return this.serviceGroupRepository.find(options);
  }

  findOne(options: FindManyOptions<ServiceGroupEntity>): Promise<ServiceGroupEntity> {
    return this.serviceGroupRepository.findOne(options);
  }

  findAndCount(options?: FindManyOptions<ServiceGroupEntity>): Promise<[ServiceGroupEntity[], number]> {
    return this.serviceGroupRepository.findAndCount(options);
  }

  remove(entity: ServiceGroupEntity): Promise<ServiceGroupEntity> {
    return this.serviceGroupRepository.remove(entity);
  }

  async count(options: FindManyOptions<ServiceGroupEntity>): Promise<number> {
    return this.serviceGroupRepository.count(options);
  }
}
