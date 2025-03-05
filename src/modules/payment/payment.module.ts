import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentModule as MerchantPaymentModule } from '../merchant/payment/payment.module';

@Module({
  imports: [forwardRef(() => MerchantPaymentModule)],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
