import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  controllers: [],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantsModule {}
