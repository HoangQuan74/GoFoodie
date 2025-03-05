import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { PaginationQuery } from 'src/common/query';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import * as moment from 'moment';
import { EClientCoinType } from 'src/common/enums';

@Controller('coins')
@UseGuards(AuthGuard)
@ApiTags('Coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @Get('history')
  async getCoinHistory(@Query() query: PaginationQuery, @CurrentUser() user: JwtPayload) {
    const { page, limit } = query;

    const queryBuilder = this.coinsService
      .createQueryBuilder('history')
      .withDeleted()
      .select(['history.id as id', 'history.amount::INT as amount', 'history.createdAt as "createdAt"'])
      .addSelect(['history.type as type', 'history.balance::INT as balance'])
      .addSelect(['order.orderCode as "orderCode"', 'store.name as "storeName"'])
      .innerJoin('history.order', 'order')
      .innerJoin('order.store', 'store')
      .orderBy('history.id', 'DESC')
      .where('history.clientId = :clientId', { clientId: user.id })
      .limit(limit)
      .offset((page - 1) * limit);

    const [items, total] = await Promise.all([queryBuilder.getRawMany(), queryBuilder.getCount()]);

    return { items, total };
  }

  @Get('expire')
  async getExpireCoins(@Query() query: PaginationQuery, @CurrentUser() user: JwtPayload) {
    const { page, limit } = query;
    const expireDate = moment().add(7, 'days').toDate();

    const queryBuilder = this.coinsService
      .createQueryBuilder('history')
      .select(['history.id', 'history.amount', 'history.expiredAt', 'history.used', 'history.createdAt'])
      .where('history.clientId = :clientId', { clientId: user.id })
      .andWhere('history.expiredAt <= :expireDate', { expireDate })
      .andWhere('history.amount > history.used')
      .andWhere('history.isRecovered = false')
      .andWhere('history.type = :type', { type: EClientCoinType.Review })
      .orderBy('history.expiredAt', 'ASC')
      .limit(limit)
      .offset((page - 1) * limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    items.forEach((item) => {
      item.amount = Number(item.amount);
      item.used = Number(item.used);
    });

    return { items, total };
  }

  @Get('balance')
  async getBalance(@CurrentUser() user: JwtPayload) {
    return this.coinsService.getBalance(user.id);
  }
}
