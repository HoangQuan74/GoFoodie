import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import { CheckAccountDto } from './dto/check-account.dto';
import { Public } from 'src/common/decorators';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('ipn/9pay')
  @Public()
  async ipn9Pay(@Body() body: IPN9PayDto) {
    const data = await this.paymentService.decodeResult(body);
    if (!data) return;

    console.log(data);
    const { invoice_no: invoiceNo, amount, status } = data;

    if (status === 1) {
      console.log('success');
    } else if (status === 0) {
      console.log('fail');
    }
  }

  @Post('check-account')
  async checkAccount(@Body() body: CheckAccountDto) {
    const result = await this.paymentService.checkAccount(body);
    return { result };
  }
}
