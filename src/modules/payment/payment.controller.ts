import { Body, Controller, Post } from '@nestjs/common';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import { CheckAccountDto } from './dto/check-account.dto';
import { Public } from 'src/common/decorators';
import { ETransactionStatus, EUserType } from 'src/common/enums';
import { PaymentService as MerchantPaymentService } from 'src/modules/merchant/payment/payment.service';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly merchantPaymentService: MerchantPaymentService,
  ) {}

  @Post('ipn/9pay')
  @Public()
  async ipn9Pay(@Body() body: IPN9PayDto) {
    const data = await this.paymentService.decodeResult(body);
    if (!data) return;

    const { invoice_no: invoiceNo, status } = data;
    console.log('IPN 9Pay', data);
    const userType = invoiceNo.split('-')[0].toLowerCase();

    switch (userType) {
      case EUserType.Client:
        // code here
        break;
      case EUserType.Merchant:
        if (status === 5 || status === 16) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        // code here

        break;
      case EUserType.Driver:
      // code here
    }
  }

  @Post('check-account')
  async checkAccount(@Body() body: CheckAccountDto) {
    const result = await this.paymentService.checkAccount(body);
    return { result };
  }
}
