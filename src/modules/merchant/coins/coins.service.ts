import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreCoinHistoryEntity } from 'src/database/entities/store-coin-history.entity';
import { Repository } from 'typeorm';
import { EStoreCoinType } from 'src/common/enums';
import { CreateCoinDto, QueryCoinDto } from './dto';
import { StoreCoinEventEntity } from 'src/database/entities/store-coin-event.entity';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(StoreCoinHistoryEntity)
    private readonly coinHistoryRepository: Repository<StoreCoinHistoryEntity>,

    @InjectRepository(StoreCoinEventEntity)
    private readonly coinEventRepository: Repository<StoreCoinEventEntity>,
  ) {}

  async getCoinOfStore(storeId: number) {
    const coin = await this.getLatestCoinOfStore(storeId);
    const coinEvents = await this.coinEventRepository
      .createQueryBuilder('coinEvent')
      .select('SUM(coinEvent.promotionCoin) as "promotionCoin"')
      .where('coinEvent.storeId = :storeId', { storeId })
      .getRawOne();

    return {
      balance: coin.balance,
      promotionCoin: coinEvents?.promotionCoin || 0,
    };
  }

  async getCoinHistoryOfStore(storeId: number, query: QueryCoinDto) {
    const { limit, page, type, startDate, endDate } = query;
    const queryBuilder = this.coinHistoryRepository
      .createQueryBuilder('coinHistory')
      .where('coinHistory.storeId = :storeId', { storeId });

    if (type) queryBuilder.andWhere('coinHistory.type = :type', { type });
    if (startDate) queryBuilder.andWhere('coinHistory.createdAt >= :startDate', { startDate });
    if (endDate) queryBuilder.andWhere('coinHistory.createdAt <= :endDate', { endDate });

    queryBuilder.orderBy('coinHistory.createdAt', 'DESC');
    const [items, total] = await queryBuilder
      .skip(limit * (page - 1))
      .take(limit)
      .getManyAndCount();

    return { items, total };
  }

  private async getLatestCoinOfStore(storeId: number) {
    const coin = await this.coinHistoryRepository.findOne({
      where: { storeId },
      select: {
        storeId: true,
        balance: true,
        amount: true,
      },
      order: { createdAt: 'DESC' },
    });
    if (!coin) {
      return this.coinHistoryRepository.create({ storeId, balance: 0, amount: 0 });
    }
    return {
      ...coin,
      balance: Number(coin.balance),
      amount: Number(coin.amount),
    };
  }

  async addCoin(storeId: number, createCoinDto: CreateCoinDto) {
    const coin = await this.getLatestCoinOfStore(storeId);
    return this.coinHistoryRepository.save({
      storeId: storeId,
      amount: createCoinDto.amount,
      balance: coin.balance + createCoinDto.amount,
      type: EStoreCoinType.SHOP_TOPUP,
    });
  }
}
