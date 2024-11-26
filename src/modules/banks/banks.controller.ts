import { Controller, Get } from '@nestjs/common';
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
  async getBranches() {
    return [];
  }
}
