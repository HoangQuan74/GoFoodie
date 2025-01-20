import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';
import { AdminsModule } from '../admins/admins.module';
import { ChallengeTypeEntity } from 'src/database/entities/challenge-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeEntity, ChallengeTypeEntity]), AdminsModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
