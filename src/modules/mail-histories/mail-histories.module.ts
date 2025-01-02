import { Module } from '@nestjs/common';
import { MailHistoriesService } from './mail-histories.service';
import { MailHistoriesController } from './mail-histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailHistoryEntity } from 'src/database/entities/mail-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MailHistoryEntity])],
  controllers: [MailHistoriesController],
  providers: [MailHistoriesService],
  exports: [MailHistoriesService],
})
export class MailHistoriesModule {}
