import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PaymentService } from 'src/modules/payment/payment.service';
import { EAccountType } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';
import { CheckAccountDto } from 'src/modules/payment/dto/check-account.dto';
import { Not } from 'typeorm';

@Controller('banks')
@UseGuards(AuthGuard)
export class BanksController {
  constructor(
    private readonly banksService: BanksService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  async create(@Body() createBankDto: CreateBankDto, @CurrentStore() storeId: number) {
    const { bankId, bankAccountNumber: accountNo } = createBankDto;

    const bankAccount = await this.banksService.findOne({ where: { storeId, bankAccountNumber: accountNo } });
    if (bankAccount) throw new BadRequestException(EXCEPTIONS.ACCOUNT_EXISTED);

    const bankCode = await this.banksService.getBankCodeFromBankId(bankId);
    const checkAccountDto: CheckAccountDto = { accountNo, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    return this.banksService.save({ ...createBankDto, storeId, bankAccountName: account.account_name });
  }

  @Get()
  async getBanks(@CurrentStore() storeId: number) {
    return this.banksService.find({ where: { storeId }, relations: ['bank'] });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder('bankAccount')
      .leftJoinAndSelect('bankAccount.bank', 'bank')
      .where('bankAccount.storeId = :storeId', { storeId })
      .andWhere('bankAccount.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    return bankAccount;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBankDto: UpdateBankDto, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder('bankAccount')
      .where('bankAccount.storeId = :storeId', { storeId })
      .andWhere('bankAccount.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();

    Object.assign(bankAccount, updateBankDto);
    const { bankAccountNumber } = bankAccount;

    const isExist = await this.banksService.findOne({ where: { storeId, bankAccountNumber, id: Not(id) } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.ACCOUNT_EXISTED);

    const bankCode = await this.banksService.getBankCodeFromBankId(bankAccount.bankId);
    const checkAccountDto = { accountNo: bankAccountNumber, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    return this.banksService.save(bankAccount);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder('bankAccount')
      .where('bankAccount.storeId = :storeId', { storeId })
      .andWhere('bankAccount.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    if (bankAccount.isDefault) throw new BadRequestException('Không thể xóa tài khoản mặc định');

    return this.banksService.remove(bankAccount);
  }
}
