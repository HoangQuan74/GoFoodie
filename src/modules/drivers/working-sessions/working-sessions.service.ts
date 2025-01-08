import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverWorkingSessionEntity } from 'src/database/entities/working-sessions.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class WorkingSessionsService {
  constructor(
    @InjectRepository(DriverWorkingSessionEntity)
    private readonly driverWorkingSessionRepository: Repository<DriverWorkingSessionEntity>,
  ) {}

  async findOne(options: FindOneOptions<DriverWorkingSessionEntity>) {
    return this.driverWorkingSessionRepository.findOne(options);
  }

  async save(entity: Partial<DriverWorkingSessionEntity>) {
    return this.driverWorkingSessionRepository.save(entity);
  }
}
