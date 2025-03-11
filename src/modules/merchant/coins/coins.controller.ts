import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { CreateCoinDto, QueryCoinDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Coin')
@Controller('coins')
@UseGuards(AuthGuard)
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Post()
  addCoin(@Body() createCoinDto: CreateCoinDto, @CurrentStore() storeId: number) {
    return this.coinsService.addCoin(storeId, createCoinDto);
  }

  @Get('')
  getCoinOfStore(@CurrentStore() storeId: number) {
    return this.coinsService.getCoinOfStore(storeId);
  }

  @Get('history')
  getCoinHistoryOfStore(@CurrentStore() storeId: number, @Query() query: QueryCoinDto) {
    return this.coinsService.getCoinHistoryOfStore(storeId, query);
  }
}
