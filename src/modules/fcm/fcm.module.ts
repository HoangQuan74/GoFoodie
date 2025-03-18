import { Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/database/entities/order.entity';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, MerchantEntity])],
  controllers: [],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule {}
