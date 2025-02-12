import { Injectable } from '@nestjs/common';
import { DriverCardEntity } from 'src/database/entities/driver-card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(DriverCardEntity)
    private cardRepository: Repository<DriverCardEntity>,
  ) {}

  async save(entity: Partial<DriverCardEntity>) {
    return this.cardRepository.save(entity);
  }

  async find(options?: FindManyOptions<DriverCardEntity>) {
    return this.cardRepository.find(options);
  }

  async findOne(options: FindOneOptions<DriverCardEntity>) {
    return this.cardRepository.findOne(options);
  }

  async remove(entity: DriverCardEntity) {
    return this.cardRepository.softRemove(entity);
  }
}
