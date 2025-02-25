import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticalService } from './statistical.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { QueryRevenueChartDto } from './dto';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { PaginationQuery } from 'src/common/query';

@ApiTags('Statistical')
@Controller('statistical')
@UseGuards(AuthGuard)
export class StatisticalController {
  constructor(private readonly statisticalService: StatisticalService) {}

  @Get('/chart')
  @ApiOperation({ summary: 'get revenue chart' })
  async getRevenueChart(@Query() query: QueryRevenueChartDto, @CurrentStore() storeId: number) {
    const { type } = query;
    return this.statisticalService.getRevenueChart(type, storeId);
  }

  @Get('/top-product/revenue')
  @ApiOperation({ summary: 'get top product revenue' })
  async getListProduct(@Query() query: PaginationQuery, @CurrentStore() storeId: number) {
    return this.statisticalService.getTopProductsRevenue(storeId, query);
  }

  @Get('/top-product/sold')
  @ApiOperation({ summary: 'get top product sold' })
  async getListProductSold(@Query() query: PaginationQuery, @CurrentStore() storeId: number) {
    return this.statisticalService.getTopProductsSold(storeId, query);
  }
}
