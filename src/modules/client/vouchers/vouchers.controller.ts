import { Controller, Get, Param, Query } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get(':code')
  async findOne(@Param('code') code: string, @Query('cartId') cartId: number) {
    try {
      return await this.vouchersService.checkVoucher(code, cartId);
    } catch (error) {
      return null;
    }
  }
}
