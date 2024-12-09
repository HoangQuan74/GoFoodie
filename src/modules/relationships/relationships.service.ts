import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationshipEntity } from 'src/database/entities/relationship.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(RelationshipEntity)
    private relationshipRepository: Repository<RelationshipEntity>,
  ) {}

  find(options?: FindManyOptions<RelationshipEntity>) {
    return this.relationshipRepository.find(options);
  }
}
