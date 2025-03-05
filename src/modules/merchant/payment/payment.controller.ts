import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { Query } from '@nestjs/common';
import { StoresService } from '../stores/stores.service';

@Controller('payment')
@UseGuards(AuthGuard)
@ApiTags('Payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly storeService: StoresService,
  ) {}

  @Post('deposit')
  deposit(@Body() body: CreateDepositDto, @CurrentStore() storeId: number) {
    return this.paymentService.deposit(body, storeId);
  }

  @Post('withdraw')
  withdraw(@Body() body: CreateWithdrawDto, @CurrentStore() storeId: number) {
    return this.paymentService.withdraw(body, storeId);
  }

  @Get('balance')
  getBalance(@CurrentStore() storeId: number) {
    return this.storeService.getBalance(storeId);
  }

  @Get('transactions')
  async getTransactions(@CurrentStore() storeId: number, @Query() query: QueryTransactionDto) {
    const { page, limit, status, type, startDate, endDate } = query;

    const queryBuilder = this.paymentService
      .createQueryBuild('transaction')
      .where('transaction.storeId = :storeId', { storeId })
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
}
