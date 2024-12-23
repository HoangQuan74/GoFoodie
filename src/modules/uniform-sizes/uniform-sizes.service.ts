import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UniformSizeEntity } from 'src/database/entities/uniform-size.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class UniformSizesService {
  constructor(
    @InjectRepository(UniformSizeEntity)
    private readonly uniformSizeRepository: Repository<UniformSizeEntity>,
  ) {}

  async find(options?: FindManyOptions<UniformSizeEntity>): Promise<UniformSizeEntity[]> {
    return this.uniformSizeRepository.find(options);
  }
}
