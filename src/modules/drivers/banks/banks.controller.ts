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

@Controller('banks')
@UseGuards(AuthGuard)
@ApiTags('Quản lý tài khoản ngân hàng')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post()
  create(@Body() createBankDto: CreateBankDto, @CurrentUser() user: JwtPayload) {
    return this.banksService.save({ ...createBankDto, driverId: user.id });
  }

  @Get()
  find(@CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    return this.banksService.createQueryBuilder().where('driverId = :driverId', { driverId }).getMany();
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('driverId = :driverId', { driverId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    return bankAccount;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('driverId = :driverId', { driverId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();

    Object.assign(bankAccount, updateBankDto);
    return this.banksService.save(bankAccount);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const { id: driverId } = user;
    const bankAccount = await this.banksService
      .createQueryBuilder()
      .where('driverId = :driverId', { driverId })
      .andWhere('id = :id', { id })
      .getOne();

    if (!bankAccount) throw new NotFoundException();
    if (bankAccount.isDefault) throw new BadRequestException('Không thể xóa tài khoản mặc định');

    return this.banksService.remove(bankAccount);
  }
}
