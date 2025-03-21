import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { DriversService } from '../drivers/drivers.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('payment')
@UseGuards(AuthGuard)
@ApiTags('Payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly driverService: DriversService,
  ) {}

  @Post('deposit')
  deposit(@Body() body: CreateDepositDto, @CurrentUser() driver: JwtPayload) {
    return this.paymentService.deposit(body, driver.id);
  }

  @Post('withdraw')
  withdraw(@Body() body: CreateWithdrawDto, @CurrentUser() driver: JwtPayload) {
    return this.paymentService.withdraw(body, driver.id);
  }

  @Get('balance')
  getBalance(@CurrentUser() driver: JwtPayload) {
    return this.driverService.getBalance(driver.id);
  }

  @Get('balance/pending')
  getPendingBalance(@CurrentUser() driver: JwtPayload) {
    return this.paymentService.getPendingBalance(driver.id);
  }

  @Get('transactions')
  async getTransactions(@CurrentUser() driver: JwtPayload, @Query() query: QueryTransactionDto) {
    const { page, limit, status, type, startDate, endDate } = query;

    const queryBuilder = this.paymentService
      .createQueryBuilder('transaction')
      .where('transaction.driverId = :driverId', { driverId: driver.id })
      .orderBy('transaction.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    status && queryBuilder.andWhere('transaction.status = :status', { status });
    type && queryBuilder.andWhere('transaction.type = :type', { type });
    startDate && queryBuilder.andWhere('transaction.createdAt >= :startDate', { startDate });
    endDate && queryBuilder.andWhere('transaction.createdAt <= :endDate', { endDate });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get('transaction/:id')
  getTransaction(@CurrentUser() driver: JwtPayload, @Param('id') id: number) {
    return this.paymentService
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.bank', 'bank')
      .where('transaction.driverId = :driverId', { driverId: driver.id })
      .andWhere('transaction.id = :id', { id })
      .getOne();
  }
}
