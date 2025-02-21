import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/database/entities/file.entity';
import { NoticeEntity } from 'src/database/entities/notice.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MailHistoriesModule } from '../mail-histories/mail-histories.module';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { OrderEntity } from 'src/database/entities/order.entity';
import { TitleConfigEntity } from 'src/database/entities/title-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, NoticeEntity, MerchantEntity, DriverEntity, OrderEntity, TitleConfigEntity]),
    MailHistoriesModule,
  ],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
