import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverBankEntity } from 'src/database/entities/driver-bank.entity';
import { Repository } from 'typeorm';
import { EXCEPTIONS } from 'src/common/constants';
import { BankEntity } from 'src/database/entities/bank.entity';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(DriverBankEntity)
    private driverBankRepository: Repository<DriverBankEntity>,

    @InjectRepository(BankEntity)
    private bankEntityRepository: Repository<BankEntity>,
  ) {}

  async save(entity: Partial<DriverBankEntity>) {
    const bankAccount = await this.driverBankRepository.save(entity);

    if (entity.isDefault) {
      await this.setDefaultBankAccount(entity.driverId, bankAccount.id);
    }
    return bankAccount;
  }

  async setDefaultBankAccount(driverId: number, id: number) {
    await this.driverBankRepository.update({ driverId }, { isDefault: false });
    await this.driverBankRepository.update({ driverId, id }, { isDefault: true });
  }

  async remove(entity: DriverBankEntity) {
    const count = await this.driverBankRepository.countBy({ driverId: entity.driverId });
    if (count <= 1) throw new BadRequestException(EXCEPTIONS.CANNOT_REMOVE_LAST_BANK_ACCOUNT);

    return this.driverBankRepository.softRemove(entity);
  }

  createQueryBuilder(alias?: string) {
    return this.driverBankRepository.createQueryBuilder(alias);
  }

  async getBankCodeFromBankId(bankId: number) {
    const bank = await this.bankEntityRepository.findOneBy({ id: bankId });
    return bank?.code;
  }
}
