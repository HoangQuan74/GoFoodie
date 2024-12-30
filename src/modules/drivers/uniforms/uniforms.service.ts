import { Injectable } from '@nestjs/common';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverUniformEntity } from 'src/database/entities/driver-uniform.entity';

@Injectable()
export class UniformsService {
  constructor(
    @InjectRepository(UniformEntity)
    private uniformRepository: Repository<UniformEntity>,

    @InjectRepository(DriverUniformEntity)
    private driverUniformRepository: Repository<DriverUniformEntity>,
  ) {}

  async findOne(options?: FindOneOptions<UniformEntity>) {
    return this.uniformRepository.findOne(options);
  }

  async findOneDriverUniform(options?: FindOneOptions<DriverUniformEntity>) {
    return this.driverUniformRepository.findOne(options);
  }
}
