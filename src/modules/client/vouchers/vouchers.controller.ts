import { Controller, Get, Param, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get(':code')
  async findOne(@Param('code') code: string, @Query('cartId') cartId: number) {
    return this.vouchersService.checkVoucher(code, cartId);
  }
}
