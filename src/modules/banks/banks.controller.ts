import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { BanksService } from './banks.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('banks')
@ApiTags('Banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @Public()
  async find() {
    return this.banksService.find();
  }

  @Get(':id/branches')
  @Public()
  async getBranches(@Param('id') id: number) {
    const bank = await this.banksService.findOne({ where: { id }, relations: ['branches'] });
    if (!bank) throw new NotFoundException();

    return bank.branches;
  }
}
