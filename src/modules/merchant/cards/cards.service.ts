import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { StoreCardEntity } from 'src/database/entities/store-card.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CheckAccountDto } from 'src/modules/payment/dto/check-account.dto';
import { PaymentService } from 'src/modules/payment/payment.service';
import { EAccountType } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(StoreCardEntity)
    private cardRepository: Repository<StoreCardEntity>,

    private readonly paymentService: PaymentService,
  ) {}

  async save(entity: Partial<StoreCardEntity>) {
    const { cardNumber: accountNo, bankCode } = entity;
    const checkAccountDto: CheckAccountDto = { accountNo, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);
    entity.cardHolder = account.account_name;

    return this.cardRepository.save(entity);
  }

  async find(options: FindManyOptions<StoreCardEntity>) {
    return this.cardRepository.find(options);
  }

  async findOne(options: FindOneOptions<StoreCardEntity>) {
    return this.cardRepository.findOne(options);
  }

  async remove(entity: StoreCardEntity) {
    return this.cardRepository.softRemove(entity);
  }
}
