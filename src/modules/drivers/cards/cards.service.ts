import { BadRequestException, Injectable } from '@nestjs/common';
import { DriverCardEntity } from 'src/database/entities/driver-card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { PaymentService } from 'src/modules/payment/payment.service';
import { CheckAccountDto } from 'src/modules/payment/dto/check-account.dto';
import { EAccountType } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(DriverCardEntity)
    private cardRepository: Repository<DriverCardEntity>,

    private readonly paymentService: PaymentService,
  ) {}

  async save(entity: Partial<DriverCardEntity>) {
    const { cardNumber: accountNo, bankCode } = entity;
    const checkAccountDto: CheckAccountDto = { accountNo, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);
    entity.cardHolder = account.account_name;

    return this.cardRepository.save(entity);
  }

  async find(options?: FindManyOptions<DriverCardEntity>) {
    return this.cardRepository.find(options);
  }

  async findOne(options: FindOneOptions<DriverCardEntity>) {
    return this.cardRepository.findOne(options);
  }

  async remove(entity: DriverCardEntity) {
    return this.cardRepository.softRemove(entity);
  }
}
