import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { OptionEntity } from 'src/database/entities/option.entity';

@Injectable()
export class OptionGroupsService {
  constructor(
    @InjectRepository(OptionGroupEntity)
    private readonly optionGroupRepository: Repository<OptionGroupEntity>,

    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {}

  async find(options: FindManyOptions<OptionGroupEntity>) {
    return this.optionGroupRepository.find(options);
  }

  async findOne(options: FindOneOptions<OptionGroupEntity>) {
    return this.optionGroupRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<OptionGroupEntity>) {
    return this.optionGroupRepository.findAndCount(options);
  }

  async save(entity: DeepPartial<OptionGroupEntity>) {
    return this.optionGroupRepository.save(entity);
  }

  async findOptions(options?: FindManyOptions<OptionEntity>): Promise<OptionEntity[]> {
    return this.optionRepository.find(options);
  }

  async remove(entity: OptionGroupEntity) {
    return this.optionGroupRepository.remove(entity);
  }

  async count(options: FindManyOptions<OptionGroupEntity>) {
    return this.optionGroupRepository.count(options);
  }
}
