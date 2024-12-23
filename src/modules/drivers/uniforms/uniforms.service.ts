import { Injectable } from '@nestjs/common';
import { UniformEntity } from 'src/database/entities/uniform.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UniformsService {
  constructor(
    @InjectRepository(UniformEntity)
    private uniformRepository: Repository<UniformEntity>,
  ) {}

  async findOne(options?: FindOneOptions<UniformEntity>) {
    return this.uniformRepository.findOne(options);
  }
}
