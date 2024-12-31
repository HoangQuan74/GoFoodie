import { Module } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { NoticesController } from './notices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from 'src/database/entities/notice.entity';
import { NoticeTypeEntity } from 'src/database/entities/notice-type.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity, NoticeTypeEntity]), AdminsModule],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
