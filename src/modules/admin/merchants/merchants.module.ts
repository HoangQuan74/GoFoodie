import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
