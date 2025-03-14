import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CoinsService } from './coins.service';
import { PaginationQuery } from 'src/common/query';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import * as moment from 'moment';
import { EClientCoinType, EOrderStatus } from 'src/common/enums';
import { OrderService } from '../order/order.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Brackets } from 'typeorm';

@Controller('coins')
@UseGuards(AuthGuard)
@ApiTags('Coins')
export class CoinsController {
  constructor(
    private readonly coinsService: CoinsService,
    private readonly orderService: OrderService,
    private readonly reviewService: ReviewsService,
  ) {}

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
      .select([
        'history.id',
        'history.amount',
        'history.expiredAt',
        'history.used',
        'history.createdAt',
        'history.type',
      ])
      .where('history.clientId = :clientId', { clientId: user.id })
      .andWhere('history.expiredAt <= :expireDate', { expireDate })
      .andWhere('history.expiredAt >= NOW()')
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

  @Get('review')
  async getReviewCoins(@Query() query: PaginationQuery, @CurrentUser() user: JwtPayload) {
    const { page, limit } = query;

    const reward = await this.reviewService.getReward();
    if (!reward) return { items: [], total: 0, reward: null };

    const queryBuilder = this.orderService
      .createQueryBuilder('order')
      .select([
        'order.id as "orderId"',
        'order.orderCode as "orderCode"',
        'store.name as "storeName"',
        'activity.createdAt as "completedAt"',
      ])
      .innerJoin('order.activities', 'activity', 'activity.status = :status')
      .innerJoin('order.store', 'store')
      .leftJoin('order.driverReviews', 'driverReview')
      .leftJoin('order.storeReviews', 'storeReview')
      .where('order.clientId = :clientId', { clientId: user.id })
      .andWhere('order.status = :orderStatus')
      .andWhere(
        new Brackets((qb) => {
          qb.where('driverReview.id IS NULL');
          qb.orWhere('storeReview.id IS NULL');
        }),
      )
      .setParameters({ status: EOrderStatus.Delivered, orderStatus: EOrderStatus.Delivered })
      .limit(limit)
      .offset((page - 1) * limit);

    const items = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return { items, total, reward };
  }

  @Get('expired-daily')
  async getExpiredCoinsDaily(@CurrentUser() user: JwtPayload) {
    return this.coinsService
      .createQueryBuilder('history')
      .select(`(history.expired_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Ho_Chi_Minh')`, 'expiredAt')
      .addSelect('SUM(history.amount - history.used)::INT', 'amount')
      .where('history.clientId = :clientId', { clientId: user.id })
      .andWhere('history.amount > history.used')
      .andWhere('history.isRecovered = false')
      .andWhere('history.type = :type', { type: EClientCoinType.Review })
      .orderBy('history.expiredAt', 'ASC')
      .groupBy('history.expiredAt')
      .getRawMany();
  }
}
