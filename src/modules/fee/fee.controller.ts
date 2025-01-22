import { Controller, Get, Param } from '@nestjs/common';
import { FeeService } from './fee.service';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get('shipping/:distance')
  async getShippingFee(@Param('distance') distance: number) {
    return this.feeService.getShippingFee(distance);
  }
}
