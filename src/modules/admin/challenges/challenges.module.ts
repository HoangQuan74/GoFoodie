import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeEntity } from 'src/database/entities/challenge.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeEntity])],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule {}
