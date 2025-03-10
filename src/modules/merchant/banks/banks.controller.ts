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

@Controller('banks')
@UseGuards(AuthGuard)
export class BanksController {
  constructor(private readonly banksService: BanksService) {}
  @Post()
  create(@Body() createBankDto: CreateBankDto, @CurrentStore() storeId: number) {
    return this.banksService.save({ ...createBankDto, storeId });
  }

  @Get()
  async getBanks(@CurrentStore() storeId: number) {
    return this.banksService.find({ where: { storeId }, relations: ['bank'] });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('storeId = :storeId', { storeId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    return bankAccount;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('storeId = :storeId', { storeId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();

    Object.assign(bankAccount, updateBankDto);
    return this.banksService.save(bankAccount);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentStore() storeId: number) {
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('storeId = :storeId', { storeId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    if (bankAccount.isDefault) throw new BadRequestException('Không thể xóa tài khoản mặc định');

    return this.banksService.remove(bankAccount);
  }
}
