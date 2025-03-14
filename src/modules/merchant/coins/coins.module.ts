import { forwardRef, Module } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CoinsController } from './coins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreCoinHistoryEntity } from 'src/database/entities/store-coin-history.entity';
import { MerchantModule } from '../merchants/merchant.module';
import { StoreEntity } from 'src/database/entities/store.entity';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreCoinHistoryEntity, StoreEntity, StoreTransactionHistoryEntity]),
    forwardRef(() => MerchantModule),
    forwardRef(() => PaymentModule),
    EventsModule,
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
