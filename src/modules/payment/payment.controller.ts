import { Body, Controller, Post } from '@nestjs/common';
import { IPN9PayDto } from './dto/ipn-9pay.dto';
import { CheckAccountDto } from './dto/check-account.dto';
import { Public } from 'src/common/decorators';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('ipn/9pay')
  @Public()
  async ipn9Pay(@Body() body: IPN9PayDto) {
    const data = await this.paymentService.decodeResult(body);
    if (!data) return;
    this.paymentService.handleIPN9Pay(data);
  }

  @Post('check-account')
  async checkAccount(@Body() body: CheckAccountDto) {
    const result = await this.paymentService.checkAccount(body);
    return { result };
  }
}
