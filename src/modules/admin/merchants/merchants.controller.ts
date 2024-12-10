import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { ApiTags } from '@nestjs/swagger';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { QueryMerchantDto } from './dto/query-merchant.dto';
import { Brackets, In, Not } from 'typeorm';
import { EXCEPTIONS } from 'src/common/constants';
import { IdentityQuery } from 'src/common/query';

@Controller('merchants')
@ApiTags('Admin Merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  async create(@Body() createMerchantDto: CreateMerchantDto) {
    const { password, email, phone } = createMerchantDto;

    if (phone) {
      const phoneConflict = await this.merchantsService.count({ where: { phone } });
      if (phoneConflict) throw new ConflictException(EXCEPTIONS.PHONE_CONFLICT);
    }

    if (email) {
      const emailConflict = await this.merchantsService.count({ where: { email } });
      if (emailConflict) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    const newMerchant = new MerchantEntity();
    Object.assign(newMerchant, createMerchantDto);
    email && (newMerchant.emailVerifiedAt = new Date());
    password && (newMerchant.password = hashPassword(password));

    return this.merchantsService.save(newMerchant);
  }

  @Get()
  async find(@Query() query: QueryMerchantDto) {
    const { limit, page, search, status, sort, createdAtFrom, createdAtTo } = query;

    const queryBuilder = this.merchantsService.createViewBuilder('merchant').where('merchant.storeId IS NULL');

    if (search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('merchant.name ILIKE :search', { search: `%${search}%` })
            .orWhere('merchant.email ILIKE :search', { search: `%${search}%` })
            .orWhere('merchant.phone ILIKE :search', { search: `%${search}%` });
        }),
      );
    }
    status && queryBuilder.andWhere('merchant.status = :status', { status });
    createdAtFrom && queryBuilder.andWhere('merchant.createdAt >= :createdAtFrom', { createdAtFrom });
    createdAtTo && queryBuilder.andWhere('merchant.createdAt <= :createdAtTo', { createdAtTo });
    queryBuilder.take(limit).skip(limit * (page - 1));

    if (sort) {
      const [field, order] = sort.split(':') as [keyof MerchantEntity, 'ASC' | 'DESC'];
      queryBuilder.orderBy(`merchant.${field}`, order);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
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
    const { password, email, phone } = updateMerchantDto;
    delete updateMerchantDto.password;

    const options = { where: { id: +id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    if (email) {
      const emailConflict = await this.merchantsService.findOne({ where: { email, id: Not(merchant.id) } });
      if (emailConflict) throw new ConflictException(EXCEPTIONS.EMAIL_CONFLICT);
    }

    if (phone) {
      const phoneConflict = await this.merchantsService.findOne({ where: { phone, id: Not(merchant.id) } });
      if (phoneConflict) throw new ConflictException(EXCEPTIONS.PHONE_CONFLICT);
    }

    Object.assign(merchant, updateMerchantDto);
    password && (merchant.password = hashPassword(password));
    email && !merchant.emailVerifiedAt && (merchant.emailVerifiedAt = new Date());

    return this.merchantsService.save(merchant);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const options = { where: { id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    return this.merchantsService.remove(merchant);
  }

  @Delete()
  async removeMultiple(@Body() query: IdentityQuery) {
    const { ids } = query;
    const options = {
      where: { id: In(ids) },
      relations: { stores: { workingTimes: true, banks: true, representative: true } },
    };
    const merchants = await this.merchantsService.find(options);
    if (!merchants.length) throw new NotFoundException();

    return this.merchantsService.remove(merchants);
  }
}
