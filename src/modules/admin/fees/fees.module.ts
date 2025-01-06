import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeeEntity]), AdminsModule],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
