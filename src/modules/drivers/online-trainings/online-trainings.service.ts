import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineTrainingEntity } from 'src/database/entities/online-training.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class OnlineTrainingsService {
  constructor(
    @InjectRepository(OnlineTrainingEntity)
    private readonly onlineTrainingRepository: Repository<OnlineTrainingEntity>,
  ) {}

  async find(options: FindManyOptions<OnlineTrainingEntity> = {}): Promise<OnlineTrainingEntity[]> {
    return this.onlineTrainingRepository.find(options);
  }
}
