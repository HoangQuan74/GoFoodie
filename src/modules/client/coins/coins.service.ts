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

  createQueryBuilder(alias?: string) {
    return this.coinHistoryRepository.createQueryBuilder(alias);
  }

  async getBalance(clientId: number): Promise<number> {
    const client = await this.clientService.findOne({ select: ['coins'], where: { id: clientId } });
    return Number(client?.coins || 0);
  }
}
