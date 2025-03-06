import { Injectable } from '@nestjs/common';
import { ClientCoinHistoryEntity } from 'src/database/entities/client-coin-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientService } from '../clients/client.service';
import { OrderService } from '../order/order.service';

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
}
