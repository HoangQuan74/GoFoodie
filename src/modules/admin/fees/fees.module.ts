import { Module } from '@nestjs/common';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeEntity } from 'src/database/entities/fee.entity';
import { FeeTypeEntity } from 'src/database/entities/fee-type.entity';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeeEntity, FeeTypeEntity]), AdminsModule],
  controllers: [FeesController],
  providers: [FeesService],
})
export class FeesModule {}
