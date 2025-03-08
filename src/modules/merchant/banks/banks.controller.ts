import { Controller, Get, UseGuards } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('banks')
@UseGuards(AuthGuard)
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  async getBanks(@CurrentStore() storeId: number) {
    return this.banksService.find({ where: { storeId }, relations: ['bank'] });
  }
}
