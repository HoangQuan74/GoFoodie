import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientAddressEntity } from 'src/database/entities/client-address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(ClientAddressEntity)
    private addressRepository: Repository<ClientAddressEntity>,
  ) {}

  async save(entity: Partial<ClientAddressEntity>) {
    return this.addressRepository.save(entity);
  }

  async find(options: FindManyOptions<ClientAddressEntity>) {
    return this.addressRepository.find(options);
  }

  async findOne(options: FindOneOptions<ClientAddressEntity>) {
    return this.addressRepository.findOne(options);
  }

  async remove(entity: ClientAddressEntity) {
    return this.addressRepository.softRemove(entity);
  }

  async update(optionWhere: FindOptionsWhere<ClientAddressEntity>, entity: Partial<ClientAddressEntity>) {
    return this.addressRepository.update(optionWhere, entity);
  }
}
