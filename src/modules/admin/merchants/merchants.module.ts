import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MerchantView } from 'src/database/views/merchant.view';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantEntity, MerchantView])],
  controllers: [MerchantsController],
  providers: [MerchantsService],
})
export class MerchantsModule {}
