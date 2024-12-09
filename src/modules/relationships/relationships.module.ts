import { Module } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { RelationshipsController } from './relationships.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipEntity } from 'src/database/entities/relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RelationshipEntity])],
  controllers: [RelationshipsController],
  providers: [RelationshipsService],
})
export class RelationshipsModule {}
