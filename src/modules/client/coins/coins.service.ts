import { Injectable } from '@nestjs/common';
import { ClientCoinHistoryEntity } from 'src/database/entities/client-coin-history.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from '../clients/client.service';
import { OrderService } from '../order/order.service';
import { EClientCoinType } from 'src/common/enums';
import { BATCH_SIZE } from 'src/common/constants/common.constant';

@Injectable()
export class CoinsService {
  constructor(
    @InjectRepository(ClientCoinHistoryEntity)
    private readonly coinHistoryRepository: Repository<ClientCoinHistoryEntity>,

    private readonly clientService: ClientService,
    private readonly orderService: OrderService,
  ) {}

  async save(data: Partial<ClientCoinHistoryEntity>) {
    return this.coinHistoryRepository.save(data);
  }

  createQueryBuilder(alias?: string) {
    return this.coinHistoryRepository.createQueryBuilder(alias);
  }

  async getBalance(clientId: number): Promise<number> {
    const client = await this.clientService.findOne({ select: ['coins'], where: { id: clientId } });
    return Number(client?.coins || 0);
  }

  async increment(clientId: number, data: ClientCoinHistoryEntity) {
    const { amount } = data;

    const balance = await this.getBalance(clientId);
    data.balance = balance + amount;
    await this.save(data);

    return this.clientService.updateCoin(clientId, amount);
  }

  async decrement(clientId: number, data: ClientCoinHistoryEntity) {
    const { amount } = data;

    const balance = await this.getBalance(clientId);
    data.balance = balance - amount;
    await this.save(data);

    return this.clientService.updateCoin(clientId, -amount);
  }

  async revokeExpiredCoins() {
    const now = new Date();

    const queryBuilder = this.coinHistoryRepository
      .createQueryBuilder('coin')
      .select(['coin.clientId', 'SUM(coin.amount - coin.used) as total'])
      .where('coin.expiredAt < :now', { now })
      .andWhere('coin.isRecovered = false')
      .andWhere('coin.type = :type', { type: EClientCoinType.Review })
      .andWhere('coin.amount > coin.used')
      .orderBy('coin.clientId')
      .limit(BATCH_SIZE)
      .groupBy('coin.clientId');

    const count = await queryBuilder.getCount();
    if (!count) return;

    const pages = Math.ceil(count / BATCH_SIZE);
    for (let i = 0; i < pages; i++) {
      const expiredCoins = await queryBuilder.offset(i * BATCH_SIZE).getRawMany();

      for (const { clientId, total } of expiredCoins) {
        const newCoinHistory = new ClientCoinHistoryEntity();
        newCoinHistory.clientId = clientId;
        newCoinHistory.amount = +total;
        newCoinHistory.type = EClientCoinType.Expired;
        await this.decrement(clientId, newCoinHistory);

        await this.coinHistoryRepository
          .createQueryBuilder()
          .update(ClientCoinHistoryEntity)
          .set({ isRecovered: true })
          .where('clientId = :clientId', { clientId })
          .andWhere('expiredAt < :now', { now })
          .andWhere('isRecovered = false')
          .andWhere('type = :type', { type: EClientCoinType.Review })
          .andWhere('amount > used')
          .execute();
      }
    }
  }
}
