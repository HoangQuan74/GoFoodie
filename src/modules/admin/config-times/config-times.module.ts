import { Module } from '@nestjs/common';
import { ConfigTimesService } from './config-times.service';
import { ConfigTimesController } from './config-times.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigTimeEntity } from 'src/database/entities/config-time.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigTimeEntity]), AdminsModule],
  controllers: [ConfigTimesController],
  providers: [ConfigTimesService],
})
export class ConfigTimesModule {}
