import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreBankEntity } from 'src/database/entities/store-bank.entity';
import { MerchantModule } from '../merchants/merchant.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreBankEntity]), MerchantModule],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
