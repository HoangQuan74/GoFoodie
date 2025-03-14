import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentModule as MerchantPaymentModule } from '../merchant/payment/payment.module';
import { CoinsModule as MerchantCoinModule } from '../merchant/coins/coins.module';

@Module({
  imports: [forwardRef(() => MerchantPaymentModule), forwardRef(() => MerchantCoinModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
