import { forwardRef, Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import { BanksController } from './banks.controller';
import { DriversModule } from '../drivers/drivers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverBankEntity } from 'src/database/entities/driver-bank.entity';
import { BankEntity } from 'src/database/entities/bank.entity';
import { PaymentModule } from 'src/modules/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([DriverBankEntity, BankEntity]), forwardRef(() => DriversModule), PaymentModule],
  controllers: [BanksController],
  providers: [BanksService],
})
export class BanksModule {}
