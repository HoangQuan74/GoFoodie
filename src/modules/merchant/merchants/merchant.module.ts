import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MerchantOtpEntity } from 'src/database/entities/merchant-otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity, MerchantOtpEntity])],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantModule {}
