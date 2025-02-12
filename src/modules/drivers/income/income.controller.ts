import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryIncomeDto } from './dto/query-income.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Income')
@Controller('income')
@UseGuards(AuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) { }

  @Get()
  @ApiOperation({ summary: 'Get income for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  getIncome(@Query() query: QueryIncomeDto, @CurrentUser() user: JwtPayload) {
    const { startDate, endDate } = query
    const { id: driverId } = user;
    const queryBuilder = this.incomeService.createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    return true;
  }
}
