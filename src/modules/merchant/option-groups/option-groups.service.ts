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
    if (!entity.id) return this.optionGroupRepository.save(entity);

    const { options: tempOptions, ...rest } = entity;
    let options = tempOptions;

    if (options) {
      options = options.map((option) => ({ ...option, optionGroupId: entity.id }));
      const optionNames = options.map((option) => option.name);
      const oldOptions = await this.optionRepository.find({ where: { optionGroupId: entity.id } });
      const oldOptionNames = oldOptions.map((option) => option.name);

      const removeOptions = oldOptions.filter((option) => !optionNames.includes(option.name));
      const addOptions = options.filter((option) => !oldOptionNames.includes(option.name));

      await this.optionRepository.softRemove(removeOptions);
      await this.optionRepository.save(addOptions);
    }

    return this.optionGroupRepository.save(rest);
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
