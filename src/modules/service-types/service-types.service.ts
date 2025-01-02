import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceTypeEntity } from 'src/database/entities/service-type.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ServiceTypesService {
  constructor(
    @InjectRepository(ServiceTypeEntity)
    private readonly serviceTypeRepository: Repository<ServiceTypeEntity>,
  ) {}

  async find(options?: FindManyOptions<ServiceTypeEntity>): Promise<ServiceTypeEntity[]> {
    return this.serviceTypeRepository.find(options);
  }

  async findOne(options?: FindOneOptions<ServiceTypeEntity>): Promise<ServiceTypeEntity> {
    return this.serviceTypeRepository.findOne(options);
  }
}
