import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryIncomeDto } from './dto/query-income.dto';
import { AuthGuard } from '../auth/auth.guard';
import { EXCEPTIONS } from 'src/common/constants';

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
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select('SUM(order.deliveryFee)', 'deliveryFee')
      .addSelect('SUM(order.tip)', 'tip')
      .addSelect('SUM(order.peakHourFee)', 'peakHourFee')
      .addSelect('SUM(order.parkingFee)', 'parkingFee')
      .addSelect('COUNT(order.id)', 'totalOrder')
    const result = queryBuilder.getRawOne();
    return result;
  }

  @Get('/orders')
  @ApiOperation({ summary: 'Get list order for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  getIncomeOrders(@Query() query: QueryIncomeDto, @CurrentUser() user: JwtPayload) {
    const { startDate, endDate } = query
    const { id: driverId } = user;
    const queryBuilder = this.incomeService.createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select([
        'order.id',
        'order.orderCode',
        'order.deliveryFee',
        'order.tip',
        'order.peakHourFee',
        'order.parkingFee',
      ])
    const result = queryBuilder.getMany();
    return result;
  }

  @Get('/oredrs/:orderId')
  @ApiOperation({ summary: 'Get order detail for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  async getIncomeOrderDetails(@Param('orderId') orderId: number, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const queryBuilder = this.incomeService.createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.id = :orderId', { orderId })
      .select([
        'order.id',
        'order.orderCode',
        'order.deliveryFee',
        'order.tip',
        'order.peakHourFee',
        'order.parkingFee',
        'order.transactionFee',
        'order.appFee',
      ])
    const result = await queryBuilder.getOne();

    if (!result)
      throw new BadRequestException(EXCEPTIONS.NOT_FOUND)

    return result;
  }
}
