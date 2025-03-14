import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { PaymentModule as PaymentComponentModule } from 'src/modules/payment/payment.module';
import { MerchantModule } from '../merchants/merchant.module';
import { StoresModule } from '../stores/stores.module';
import { FeeModule } from '../fee/fee.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StoreTransactionHistoryEntity]),
    PaymentComponentModule,
    MerchantModule,
    StoresModule,
    FeeModule,
    EventsModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
