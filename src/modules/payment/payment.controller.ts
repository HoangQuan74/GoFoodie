import { Body, Controller, Post } from '@nestjs/common';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import { CheckAccountDto } from './dto/check-account.dto';
import { Public } from 'src/common/decorators';
import { ETransactionStatus } from 'src/common/enums';
import { PaymentService as MerchantPaymentService } from 'src/modules/merchant/payment/payment.service';
import { PaymentService } from './payment.service';
import { CoinsService as MerchantCoinService } from '../merchant/coins/coins.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly merchantPaymentService: MerchantPaymentService,
    private readonly merchantCoinService: MerchantCoinService,
  ) {}

  @Post('ipn/9pay')
  @Public()
  async ipn9Pay(@Body() body: IPN9PayDto) {
    const data = await this.paymentService.decodeResult(body);
    if (!data) return;

    const { invoice_no: invoiceNo, status } = data;
    console.log('IPN 9Pay', data);
    const key = invoiceNo.slice(0, 2);

    switch (key) {
      case 'deposit':
        // code here
        break;

      // Kết quả giao dịch nạp, rút tiền của merchant
      case '10':
      case '11':
        if (status === 5 || status === 16) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.merchantPaymentService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        break;
      case '13':
        if (status === 5 || status === 16) {
          this.merchantCoinService.updateTransactionStatus(invoiceNo, ETransactionStatus.Success, data);
        } else if (status !== 2 && status !== 3) {
          this.merchantCoinService.updateTransactionStatus(invoiceNo, ETransactionStatus.Failed, data);
        }
        break;
      // Kết quả giao dịch nạp, rút tiền của driver
      case '20':
      case '21':
        // code here
        break;
    }
  }

  @Post('check-account')
  async checkAccount(@Body() body: CheckAccountDto) {
    const result = await this.paymentService.checkAccount(body);
    return { result };
  }
}
