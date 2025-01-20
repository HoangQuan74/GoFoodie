import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';
import { ChallengeTypeEntity } from 'src/database/entities/challenge-type.entity';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(ChallengeEntity)
    private challengeRepository: Repository<ChallengeEntity>,

    @InjectRepository(ChallengeTypeEntity)
    private challengeTypeRepository: Repository<ChallengeTypeEntity>,
  ) {}

  async save(entity: Partial<ChallengeEntity>): Promise<ChallengeEntity> {
    return this.challengeRepository.save(entity);
  }

  async find(options: FindManyOptions<ChallengeEntity>): Promise<ChallengeEntity[]> {
    return this.challengeRepository.find(options);
  }

  async findOne(options: FindOneOptions<ChallengeEntity>): Promise<ChallengeEntity> {
    return this.challengeRepository.findOne(options);
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<ChallengeEntity> {
    return this.challengeRepository.createQueryBuilder(alias);
  }

  async remove(entity: ChallengeEntity): Promise<ChallengeEntity> {
    return this.challengeRepository.remove(entity);
  }

  async findTypes(options?: FindManyOptions<ChallengeTypeEntity>): Promise<ChallengeTypeEntity[]> {
    return this.challengeTypeRepository.find(options);
  }
}
