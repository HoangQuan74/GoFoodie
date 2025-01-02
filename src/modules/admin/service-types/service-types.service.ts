import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceTypeEntity } from 'src/database/entities/service-type.entity';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceTypeEntity)
    private readonly serviceTypeRepository: Repository<ServiceTypeEntity>,
  ) {}

  async find(options?: FindManyOptions<ServiceTypeEntity>): Promise<ServiceTypeEntity[]> {
    return this.serviceTypeRepository.find(options);
  }

  async save(entity: DeepPartial<ServiceTypeEntity>): Promise<ServiceTypeEntity> {
    return this.serviceTypeRepository.save(entity);
  }

  async saveMany(entities: DeepPartial<ServiceTypeEntity>[]): Promise<ServiceTypeEntity[]> {
    return this.serviceTypeRepository.save(entities);
  }
}
