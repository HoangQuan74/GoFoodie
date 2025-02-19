import { Module } from '@nestjs/common';
import { DriverTitleConfigsService } from './title-configs.service';
import { DriverTitleConfigsController } from './title-configs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TitleConfigEntity } from 'src/database/entities/title-config.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([TitleConfigEntity]), AdminsModule],
  controllers: [DriverTitleConfigsController],
  providers: [DriverTitleConfigsService],
})
export class DriverTitleConfigsModule {}
