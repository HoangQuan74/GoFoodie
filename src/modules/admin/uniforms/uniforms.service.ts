import { Injectable } from '@nestjs/common';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UniformsService {
  constructor(
    @InjectRepository(UniformEntity)
    private uniformRepository: Repository<UniformEntity>,
  ) {}

  async save(driverUniform: DeepPartial<UniformEntity>) {
    return this.uniformRepository.save(driverUniform);
  }

  async find(options?: FindManyOptions<UniformEntity>) {
    return this.uniformRepository.find(options);
  }

  async findOne(options: FindOneOptions<UniformEntity>) {
    return this.uniformRepository.findOne(options);
  }
}
