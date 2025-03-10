import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EXCEPTIONS } from 'src/common/constants';
import { StoreBankEntity } from 'src/database/entities/store-bank.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(StoreBankEntity)
    private readonly bankRepository: Repository<StoreBankEntity>,
  ) {}

  async save(entity: Partial<StoreBankEntity>) {
    const bankAccount = await this.bankRepository.save(entity);

    if (entity.isDefault) {
      await this.setDefaultBankAccount(entity.storeId, bankAccount.id);
    }
    return bankAccount;
  }

  async setDefaultBankAccount(storeId: number, id: number) {
    await this.bankRepository.update({ storeId }, { isDefault: false });
    await this.bankRepository.update({ storeId, id }, { isDefault: true });
  }

  async remove(entity: StoreBankEntity) {
    const count = await this.bankRepository.countBy({ storeId: entity.storeId });
    if (count <= 1) throw new BadRequestException(EXCEPTIONS.CANNOT_REMOVE_LAST_BANK_ACCOUNT);

    return this.bankRepository.softRemove(entity);
  }

  createQueryBuilder(alias?: string) {
    return this.bankRepository.createQueryBuilder(alias);
  }

  async find(options?: FindManyOptions<StoreBankEntity>) {
    return this.bankRepository.find(options);
  }
}
