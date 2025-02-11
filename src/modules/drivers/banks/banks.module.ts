import { forwardRef, Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { DriversModule } from '../drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverBankEntity } from 'src/database/entities/driver-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverBankEntity]), forwardRef(() => DriversModule)],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
