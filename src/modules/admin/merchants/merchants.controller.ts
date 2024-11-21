import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { QueryMerchantDto } from './dto/query-merchant.dto';
import { FindManyOptions, FindOptionsWhere, ILike } from 'typeorm';

@Controller('merchants')
@ApiTags('Admin Merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    const { password, email } = createMerchantDto;

    const newMerchant = new MerchantEntity();
    Object.assign(newMerchant, createMerchantDto);
    email && (newMerchant.emailVerifiedAt = new Date());
    password && (newMerchant.password = hashPassword(password));

    return this.merchantsService.save(newMerchant);
  }

  @Get()
  async find(@Query() query: QueryMerchantDto) {
    const { limit, page, search, status, sort } = query;

    const where: FindOptionsWhere<MerchantEntity> = {};
    search && (where.name = ILike(`%${search}%`));
    status && (where.status = status);

    const options: FindManyOptions<MerchantEntity> = { where, take: limit, skip: limit * (page - 1) };

    if (sort) {
      const [field, order] = sort.split(':');
      options.order = { [field]: order };
    }

    const [items, total] = await this.merchantsService.findAndCount(options);
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const options = { where: { id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    return merchant;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateMerchantDto: UpdateMerchantDto) {
    const { password, email } = updateMerchantDto;

    const options = { where: { id: +id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    Object.assign(merchant, updateMerchantDto);
    password && (merchant.password = hashPassword(password));
    email && !merchant.emailVerifiedAt && (merchant.emailVerifiedAt = new Date());

    delete merchant.password;
    return this.merchantsService.save(merchant);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const options = { where: { id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    return this.merchantsService.remove(merchant);
  }
}
