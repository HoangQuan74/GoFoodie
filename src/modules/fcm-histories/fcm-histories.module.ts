import { Module } from '@nestjs/common';
import { FcmHistoriesService } from './fcm-histories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FcmHistoryEntity } from 'src/database/entities/fcm-history.entity';
import { FcmModule } from '../fcm/fcm.module';

@Module({
  imports: [TypeOrmModule.forFeature([FcmHistoryEntity]), FcmModule],
  controllers: [],
  providers: [FcmHistoriesService],
})
export class FcmHistoriesModule {}
