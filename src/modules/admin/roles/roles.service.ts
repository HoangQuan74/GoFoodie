import { Injectable } from '@nestjs/common';
import { RoleEntity } from 'src/database/entities/role.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}

  async save(entity: DeepPartial<RoleEntity>): Promise<RoleEntity> {
    return this.roleRepository.save(entity);
  }

  async find(options?: FindManyOptions<RoleEntity>): Promise<RoleEntity[]> {
    return this.roleRepository.find(options);
  }

  async findOne(options: FindOneOptions<RoleEntity> = {}): Promise<RoleEntity> {
    return this.roleRepository.findOne(options);
  }

  async findAndCount(options?: FindManyOptions<RoleEntity>): Promise<[RoleEntity[], number]> {
    return this.roleRepository.findAndCount(options);
  }

  async remove(entity: RoleEntity): Promise<RoleEntity> {
    return this.roleRepository.remove(entity);
  }
}
