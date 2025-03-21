import { Controller, Get, Param } from '@nestjs/common';
import { VouchersService } from './vouchers.service';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.vouchersService
      .createQueryBuilder('voucher')
      .where('code = :code', { code })
      .andWhere('voucher.startTime <= NOW()')
      .andWhere('voucher.endTime >= NOW()')
      .andWhere('voucher.isActive = true')
      .getOne();
  }
}
