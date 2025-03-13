import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCardEntity } from 'src/database/entities/store-card.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { PaymentModule } from 'src/modules/payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreCardEntity]), MerchantModule, PaymentModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
