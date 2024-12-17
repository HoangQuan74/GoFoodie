import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { Repository } from 'typeorm';

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
}
