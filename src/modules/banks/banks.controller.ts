import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { BanksService } from './banks.service';
import { Public } from 'src/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { PaginationQuery } from 'src/common/query';
import { ILike } from 'typeorm';

@Controller('banks')
@ApiTags('Banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @Public()
  async find(@Query() query: PaginationQuery) {
    const { search } = query;
    return this.banksService.find({
      where: search
        ? [{ name: ILike(`%${search}%`) }, { code: ILike(`%${search}%`) }, { sortName: ILike(`%${search}%`) }]
        : {},
    });
  }

  @Get(':id/branches')
  @Public()
  async getBranches(@Param('id') id: number) {
    const bank = await this.banksService.findOne({ where: { id }, relations: ['branches'] });
    if (!bank) throw new NotFoundException();

    return bank.branches;
  }
}
