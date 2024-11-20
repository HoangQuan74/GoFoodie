import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminsRepository: Repository<AdminEntity>,
  ) {}

  save(entity: Partial<AdminEntity>) {
    return this.adminsRepository.save(entity);
  }

  find(options: FindManyOptions<AdminEntity>) {
    return this.adminsRepository.find(options);
  }

  findOne(options: FindOneOptions<AdminEntity>) {
    return this.adminsRepository.findOne(options);
  }
}
