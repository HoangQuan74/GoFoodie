import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { JwtPayload } from 'src/common/interfaces';
import { CurrentUser } from 'src/common/decorators';
import { CheckAccountDto } from 'src/modules/payment/dto/check-account.dto';
import { EAccountType } from 'src/common/enums';
import { PaymentService } from 'src/modules/payment/payment.service';
import { EXCEPTIONS } from 'src/common/constants';
import { Not } from 'typeorm';

@Controller('banks')
@UseGuards(AuthGuard)
@ApiTags('Quản lý tài khoản ngân hàng')
export class BanksController {
  constructor(
    private readonly banksService: BanksService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post()
  async create(@Body() createBankDto: CreateBankDto, @CurrentUser() user: JwtPayload) {
    const { bankId, accountNumber: accountNo } = createBankDto;
    const { id: driverId } = user;

    const isExist = await this.banksService.findOne({ where: { driverId, accountNumber: accountNo } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.ACCOUNT_EXISTED);

    const bankCode = await this.banksService.getBankCodeFromBankId(bankId);
    const checkAccountDto: CheckAccountDto = { accountNo, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    return this.banksService.save({ ...createBankDto, driverId: user.id, accountName: account.account_name });
  }

  @Get()
  find(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.banksService
      .createQueryBuilder('driverBank')
      .where('driverBank.driverId = :driverId', { driverId })
      .leftJoinAndSelect('driverBank.bank', 'bank')
      .getMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder('driverBank')
      .leftJoinAndSelect('driverBank.bank', 'bank')
      .where('driverBank.driverId = :driverId', { driverId })
      .andWhere('driverBank.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    return bankAccount;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBankDto: UpdateBankDto, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder('bank')
      .where('bank.driverId = :driverId', { driverId })
      .andWhere('bank.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();

    Object.assign(bankAccount, updateBankDto);
    const { accountNumber, bankId } = bankAccount;

    const isExist = await this.banksService.findOne({ where: { driverId, accountNumber, id: Not(id) } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.ACCOUNT_EXISTED);

    const bankCode = await this.banksService.getBankCodeFromBankId(bankId);
    const checkAccountDto: CheckAccountDto = { accountNo: accountNumber, bankCode, accountType: EAccountType.BankCard };
    const account = await this.paymentService.checkAccount(checkAccountDto);
    if (!account || account.status !== 5) throw new BadRequestException(EXCEPTIONS.INVALID_CREDENTIALS);

    return this.banksService.save(bankAccount);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder('bank')
      .where('bank.driverId = :driverId', { driverId })
      .andWhere('bank.id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    if (bankAccount.isDefault) throw new BadRequestException('Không thể xóa tài khoản mặc định');

    return this.banksService.remove(bankAccount);
  }
}
