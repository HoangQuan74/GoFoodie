import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity> {
    return this.userRepository.findOne(options);
  }

  findAll(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
    return this.userRepository.find(options);
  }

  count(options?: FindManyOptions<UserEntity>): Promise<number> {
    return this.userRepository.count(options);
  }

  create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(options: FindOptionsWhere<UserEntity>, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(options, data);
    return this.findOne({ where: options });
  }
}
