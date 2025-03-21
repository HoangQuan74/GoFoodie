import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
