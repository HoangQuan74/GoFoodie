import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentModule as MerchantPaymentModule } from '../merchant/payment/payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreTransactionHistoryEntity } from 'src/database/entities/store-transaction-history.entity';
import { CoinsModule as MerchantCoinModule } from '../merchant/coins/coins.module';

@Module({
  imports: [
    forwardRef(() => MerchantPaymentModule),
    forwardRef(() => MerchantCoinModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
