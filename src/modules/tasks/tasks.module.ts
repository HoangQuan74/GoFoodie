import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { NoticeEntity } from 'src/database/entities/notice.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, NoticeEntity, MerchantEntity])],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
