import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { IncomeService } from './income.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { QueryIncomeDto } from './dto/query-income.dto';
import { AuthGuard } from '../auth/auth.guard';
import { EXCEPTIONS } from 'src/common/constants';
import * as moment from 'moment';
import { TimeRange } from 'src/common/enums';
import { EOrderStatus } from 'src/common/enums/order.enum';

@ApiTags('Income')
@Controller('income')
@UseGuards(AuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Get()
  @ApiOperation({ summary: 'Get income for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  async getDriverIncome(@Query() query: QueryIncomeDto, @CurrentUser() user: JwtPayload) {
    const { startDate, endDate, type } = query;
    const { id: driverId } = user;

    const currentMonthStart = moment().startOf('month').toDate();
    const currentMonthEnd = moment().endOf('month').toDate();

    const calculateIncomeForPeriod = async (start: Date, end: Date) => {
      return await this.incomeService
        .createQueryBuilder('order')
        .leftJoin('order.orderFeeDiscount', 'order_fee_discount')
        .where('order.driverId = :driverId', { driverId })
        .andWhere('order.status = :orderStatus', { orderStatus: EOrderStatus.Delivered })
        .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate: start, endDate: end })
        .select('COALESCE(SUM(order_fee_discount.driverDeliveryFee), 0)', 'deliveryFee')
        .addSelect('COALESCE(SUM(order_fee_discount.driverTip), 0)', 'tip')
        .addSelect('COALESCE(SUM(order_fee_discount.driverPeakHourFee), 0)', 'peakHourFee')
        .addSelect('COALESCE(SUM(order_fee_discount.driverParkingFee), 0) ', 'parkingFee')
        .addSelect('COALESCE(SUM(order.driverIncome), 0)', 'driverIncome')
        .addSelect('COUNT(order.id) ', 'totalOrder')
        .getRawOne();
    };

    const currentMonthIncomeData = await calculateIncomeForPeriod(currentMonthStart, currentMonthEnd);
    const incomeCurrentMonth = Number(currentMonthIncomeData.driverIncome) || 0;

    const incomeData = await calculateIncomeForPeriod(startDate, endDate);
    const incomeByFilter = Number(incomeData.driverIncome) || 0;

    const { startDate: previousStart, endDate: previousEnd } = this.getPreviousTimeRange(type, startDate);
    const previousIncomeData = await calculateIncomeForPeriod(previousStart, previousEnd);
    const incomeBefore = Number(previousIncomeData.driverIncome) || 0;

    return {
      incomeCurrentMonth,
      incomeByFilter,
      incomeChangePercentage: incomeBefore !== 0 ? ((incomeByFilter - incomeBefore) / incomeBefore) * 100 : null,
      ...this.normalizeIncomeResult(incomeData),
    };
  }

  private normalizeIncomeResult(incomeData: any) {
    return {
      deliveryFee: Number(incomeData.deliveryFee),
      tip: Number(incomeData.tip),
      otherIncome: Number(incomeData.peakHourFee) + Number(incomeData.parkingFee),
      totalOrder: Number(incomeData.totalOrder),
    };
  }

  private getPreviousTimeRange(type: TimeRange, start: Date): { startDate: Date; endDate: Date } {
    const startMoment = moment(start);
    switch (type) {
      case TimeRange.DAY:
        return {
          startDate: startMoment.subtract(1, 'days').startOf('day').toDate(),
          endDate: startMoment.endOf('day').toDate(),
        };
      case TimeRange.WEEK:
        return {
          startDate: startMoment.subtract(1, 'weeks').startOf('week').toDate(),
          endDate: startMoment.endOf('week').toDate(),
        };
      case TimeRange.MONTH:
        return {
          startDate: startMoment.subtract(1, 'months').startOf('month').toDate(),
          endDate: startMoment.endOf('month').toDate(),
        };
    }
  }

  @Get('/orders')
  @ApiOperation({ summary: 'Get list order for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  async getIncomeOrders(@Query() query: QueryIncomeDto, @CurrentUser() user: JwtPayload) {
    const { startDate, endDate } = query;
    const { id: driverId } = user;
    const queryBuilder = this.incomeService
      .createQueryBuilder('order')
      .leftJoin('order.store', 'store')
      .leftJoin('store.serviceType', 'serviceType')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.status = :orderStatus', { orderStatus: EOrderStatus.Delivered })
      .andWhere('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .select('order.id', 'id')
      .addSelect('order.orderCode', 'orderCode')
      .addSelect('order.driverIncome', 'incomeOfOrder')
      .addSelect('store.id', 'storeId')
      .addSelect('serviceType.name', 'serviceType');

    const result = await queryBuilder.getRawMany();
    return result;
  }

  @Get('/orders/:orderId')
  @ApiOperation({ summary: 'Get order detail for the driver' })
  @ApiResponse({ status: 200, description: 'Returns income' })
  async getIncomeOrderDetails(@Param('orderId') orderId: number, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const queryBuilder = this.incomeService
      .createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId })
      .andWhere('order.status = :orderStatus', { orderStatus: EOrderStatus.Delivered })
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
        'order.driverIncome',
      ]);
    const result = await queryBuilder.getOne();

    if (!result) throw new BadRequestException(EXCEPTIONS.NOT_FOUND);

    return {
      ...result,
      deliveryFee: Number(result.deliveryFee),
      tip: Number(result.tip),
      peakHourFee: Number(result.peakHourFee),
      parkingFee: Number(result.parkingFee),
      transactionFee: Number(result.transactionFee),
      appFee: Number(result.appFee),
      incomeOfOrder: Number(result.driverIncome),
    };
  }
}
