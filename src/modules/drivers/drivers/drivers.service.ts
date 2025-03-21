import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverEntity)
    private driversRepository: Repository<DriverEntity>,
  ) {}

  createQueryBuilder(alias: string) {
    return this.driversRepository.createQueryBuilder(alias);
  }

  async save(entity: DriverEntity): Promise<DriverEntity> {
    return this.driversRepository.save(entity);
  }

  async findOne(options: FindOneOptions<DriverEntity>): Promise<DriverEntity> {
    return this.driversRepository.findOne(options);
  }

  merge(entity: DriverEntity, update: DeepPartial<DriverEntity>): DriverEntity {
    return this.driversRepository.merge(entity, update);
  }

  async getBalance(driverId: number): Promise<number> {
    const driver = await this.findOne({ where: { id: driverId } });
    return Number(driver?.balance || 0);
  }
}
