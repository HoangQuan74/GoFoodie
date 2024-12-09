import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverEntity)
    private driverRepository: Repository<DriverEntity>,
  ) {}

  async save(entity: DeepPartial<DriverEntity>) {
    return this.driverRepository.save(entity);
  }

  async find(options?: FindManyOptions<DriverEntity>) {
    return this.driverRepository.find(options);
  }

  async findOne(options?: FindOneOptions<DriverEntity>) {
    return this.driverRepository.findOne(options);
  }

  async remove(entity: DriverEntity) {
    return this.driverRepository.softRemove(entity);
  }

  createQueryBuilder(alias: string) {
    return this.driverRepository.createQueryBuilder(alias);
  }
}
