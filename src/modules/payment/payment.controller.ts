import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { IPN9PayDto } from './dto/ipn-9pay.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('ipn/9pay')
  async ipn9Pay(@Body() body: IPN9PayDto) {
    console.log(body);
    // return this.paymentService.ipn9Pay();
  }

  @Get('9pay/transfer')
  async transfer9Pay() {
    return this.paymentService.transfer9Pay();
  }
}
