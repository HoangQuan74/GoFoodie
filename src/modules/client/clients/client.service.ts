import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from 'src/database/entities/client.entity';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>,
  ) {}

  async findOne(options: FindOneOptions<ClientEntity>): Promise<ClientEntity> {
    return this.clientRepository.findOne(options);
  }

  async save(entity: DeepPartial<ClientEntity>): Promise<ClientEntity> {
    return this.clientRepository.save(entity);
  }

  async updateCoin(clientId: number, amount: number) {
    return this.clientRepository.increment({ id: clientId }, 'balance', amount);
  }

  async remove(clientId: number) {
    const client = await this.findOne({ where: { id: clientId } });
    return this.clientRepository.softRemove(client);
  }
}
