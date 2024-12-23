import { Injectable } from '@nestjs/common';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DriverUniformsService {
  constructor(
    @InjectRepository(UniformEntity)
    private driverUniformRepository: Repository<UniformEntity>,
  ) {}

  async save(driverUniform: DeepPartial<UniformEntity>) {
    return this.driverUniformRepository.save(driverUniform);
  }

  async find(options?: FindManyOptions<UniformEntity>) {
    return this.driverUniformRepository.find(options);
  }

  async findOne(options: FindOneOptions<UniformEntity>) {
    return this.driverUniformRepository.findOne(options);
  }
}
