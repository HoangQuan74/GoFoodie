import { Injectable } from '@nestjs/common';
import { DriverUniformEntity } from 'src/database/entities/driver-uniform.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DriverUniformsService {
  constructor(
    @InjectRepository(DriverUniformEntity)
    private driverUniformRepository: Repository<DriverUniformEntity>,
  ) {}

  async save(driverUniform: DeepPartial<DriverUniformEntity>) {
    return this.driverUniformRepository.save(driverUniform);
  }

  async find(options?: FindManyOptions<DriverUniformEntity>) {
    return this.driverUniformRepository.find(options);
  }

  async findOne(options: FindOneOptions<DriverUniformEntity>) {
    return this.driverUniformRepository.findOne(options);
  }
}
