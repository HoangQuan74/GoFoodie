import { Injectable } from '@nestjs/common';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnlineTrainingEntity } from 'src/database/entities/online-training.entity';

@Injectable()
export class OnlineTrainingsService {
  constructor(
    @InjectRepository(OnlineTrainingEntity)
    private readonly onlineTrainingRepository: Repository<OnlineTrainingEntity>,
  ) {}

  async find(options?: FindManyOptions<OnlineTrainingEntity>) {
    return this.onlineTrainingRepository.find(options);
  }

  async create(entity: DeepPartial<OnlineTrainingEntity>[]) {
    return this.onlineTrainingRepository.save(entity);
  }

  async remove(entity: OnlineTrainingEntity) {
    return this.onlineTrainingRepository.remove(entity);
  }

  async clear() {
    return this.onlineTrainingRepository.delete({});
  }
}
