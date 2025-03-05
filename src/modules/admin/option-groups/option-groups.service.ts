import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionGroupEntity } from 'src/database/entities/option-group.entity';
import { OptionEntity } from 'src/database/entities/option.entity';

@Injectable()
export class OptionGroupsService {
  constructor(
    @InjectRepository(OptionGroupEntity)
    private optionGroupRepository: Repository<OptionGroupEntity>,

    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
  ) {}

  async save(entity?: DeepPartial<OptionGroupEntity>): Promise<OptionGroupEntity> {
    if (!entity.id) return this.optionGroupRepository.save(entity);

    const { options: tempOptions, ...rest } = entity;
    let options = tempOptions;
    const newOptionGroup = await this.optionGroupRepository.save(rest);

    if (options) {
      options = options.map((option) => ({ ...option, optionGroupId: entity.id }));
      const optionNames = options.map((option) => option.name);
      const oldOptions = await this.optionRepository.find({ where: { optionGroupId: entity.id } });

      const removeOptions = oldOptions.filter((option) => !optionNames.includes(option.name));
      const upsertOptions = options.map((option) => {
        const oldOption = oldOptions.find((oldOption) => oldOption.name === option.name);
        return oldOption ? { ...oldOption, ...option } : option;
      });

      await this.optionRepository.softRemove(removeOptions);
      newOptionGroup.options = await this.optionRepository.save(upsertOptions);
    }

    return newOptionGroup;
  }

  async find(options?: FindManyOptions<OptionGroupEntity>): Promise<OptionGroupEntity[]> {
    return this.optionGroupRepository.find(options);
  }

  async findOne(options?: FindOneOptions<OptionGroupEntity>): Promise<OptionGroupEntity> {
    return this.optionGroupRepository.findOne(options);
  }

  async count(options?: FindManyOptions<OptionGroupEntity>): Promise<number> {
    return this.optionGroupRepository.count(options);
  }

  async findAndCount(options?: FindManyOptions<OptionGroupEntity>): Promise<[OptionGroupEntity[], number]> {
    return this.optionGroupRepository.findAndCount(options);
  }

  async remove(entity: OptionGroupEntity): Promise<OptionGroupEntity> {
    return this.optionGroupRepository.softRemove(entity);
  }

  async findOptions(options?: FindManyOptions<OptionEntity>): Promise<OptionEntity[]> {
    return this.optionRepository.find(options);
  }
}
