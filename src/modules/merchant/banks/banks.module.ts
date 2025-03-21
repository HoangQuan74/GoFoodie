import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreBankEntity } from 'src/database/entities/store-bank.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { BankEntity } from 'src/database/entities/bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreBankEntity, BankEntity]), MerchantModule, PaymentModule],
  controllers: [BanksController],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
