import { Controller, Get } from '@nestjs/common';
import { FeeService } from './fee.service';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get('transaction')
  async getTransactionFee() {
    return this.feeService.getTransactionFee();
  }

  @Get('deposit')
  async getDepositFee() {
    return this.feeService.getDepositFee();
  }
}
