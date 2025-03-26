import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EXCEPTIONS } from 'src/common/constants';
import { OPERATIONS } from 'src/common/constants/operation.constant';
import { Roles } from 'src/common/decorators';
import { AdminRolesGuard } from 'src/common/guards';
import { IdentityQuery } from 'src/common/query';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { hashPassword } from 'src/utils/bcrypt';
import { Brackets, In, Not } from 'typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { QueryMerchantDto, SearchMerchantByEmailPhoneDto } from './dto/query-merchant.dto';
import { UpdateMerchantByEmailPhoneDto, UpdateMerchantDto } from './dto/update-merchant.dto';
import { MerchantsService } from './merchants.service';

@Controller('merchants')
@ApiTags('Admin Merchants')
@UseGuards(AuthGuard, AdminRolesGuard)
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @Roles(OPERATIONS.MERCHANT.CREATE)
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

    const queryBuilder = this.merchantsService.createViewBuilder('merchant');

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

  @Get('email-or-phone')
  async findByEmailOrPhone(@Query() searchDto: SearchMerchantByEmailPhoneDto) {
    const { email, phone } = searchDto;

    const merchant = await this.merchantsService.findOne({
      where: [{ email: email }, { phone: phone }],
    });

    if (!merchant) {
      return null;
    }

    return merchant;
  }

  @Put('update-by-phone-email')
  @ApiOperation({ summary: 'Update a merchant by email or phone' })
  @ApiResponse({ status: 200, description: 'Merchant updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Merchant not found' })
  async updateMerchantByPhoneEmail(@Body() updateMerchantDto: UpdateMerchantByEmailPhoneDto) {
    if (!updateMerchantDto.email && !updateMerchantDto.phone) {
      throw new BadRequestException('Either email or phone must be provided to identify the merchant');
    }

    const updatedMerchant = await this.merchantsService.updateMerchant(updateMerchantDto);

    if (!updatedMerchant) {
      throw new NotFoundException('Merchant not found');
    }

    return updatedMerchant;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const options = { where: { id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    return merchant;
  }

  @Patch(':id')
  @Roles(OPERATIONS.MERCHANT.UPDATE)
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
  @Roles(OPERATIONS.MERCHANT.DELETE)
  async remove(@Param('id') id: number) {
    const options = { where: { id } };
    const merchant = await this.merchantsService.findOne(options);
    if (!merchant) throw new NotFoundException();

    return this.merchantsService.remove(merchant);
  }

  @Delete()
  @Roles(OPERATIONS.MERCHANT.DELETE)
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
