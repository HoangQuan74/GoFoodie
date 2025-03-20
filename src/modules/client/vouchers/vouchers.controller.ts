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
      .andWhere('startTime <= NOW()')
      .andWhere('endTime >= NOW()')
      .andWhere('isActive = true')
      .getOne();
  }
}
