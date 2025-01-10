import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryVoucherDto } from './dto/query-voucher.dto';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { CurrentUser } from 'src/common/decorators';
import { JwtPayload } from 'src/common/interfaces';
import { EXCEPTIONS } from 'src/common/constants';
import { Brackets, DataSource, EntityManager } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { EMaxDiscountType, EVoucherStatus } from 'src/common/enums/voucher.enum';

@Controller('vouchers')
@ApiTags('Quản lý voucher')
@UseGuards(AuthGuard)
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('types')
  async getTypes() {
    return this.vouchersService.findVoucherTypes();
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách voucher' })
  async find(@Query() query: QueryVoucherDto) {
    const { page, limit, search, startTimeFrom, startTimeTo, endTimeFrom, endTimeTo, status } = query;

    const queryBuilder = this.vouchersService
      .createQueryBuilder('voucher')
      .select(['voucher.id as id', 'voucher.code as code', 'voucher.name as name', 'voucher.isActive as "isActive"'])
      .addSelect(['voucher.startTime as "startTime"', 'voucher.endTime as "endTime"'])
      .addSelect(['voucher.maxUseTime as "maxUseTime"', 'voucher.maxUseTimePerUser as "maxUseTimePerUser"'])
      .addSelect(['voucher.discountType as "discountType"', 'voucher.discountValue as "discountValue"'])
      .addSelect(['createdBy.name as "createdByName"'])
      .addSelect(['serviceType.name as "serviceTypeName"'])
      .addSelect(['type.name as "typeName"'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)', 'count')
          .from('voucher_products', 'vp')
          .where('vp.voucher_id = voucher.id')
          .innerJoin(ProductEntity, 'product', 'product.id = vp.product_id');
      }, 'productsCount')
      .addSelect(['0 as "usedCount"'])
      .leftJoin('voucher.createdBy', 'createdBy')
      .leftJoin('voucher.serviceType', 'serviceType')
      .leftJoin('voucher.type', 'type')
      .leftJoin('voucher.products', 'products')
      .orderBy('voucher.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('voucher.code ILIKE :search', { search: `%${search}%` });
          qb.orWhere('voucher.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('type.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('serviceType.name ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (status) {
      switch (status) {
        case EVoucherStatus.NotStarted:
          queryBuilder.andWhere('voucher.startTime > NOW()');
          queryBuilder.andWhere('voucher.endTime > NOW()');
          break;
        case EVoucherStatus.InProgress:
          queryBuilder.andWhere('voucher.startTime <= NOW()');
          queryBuilder.andWhere('voucher.endTime >= NOW()');
          break;
        case EVoucherStatus.Ended:
          queryBuilder.andWhere('voucher.endTime < NOW()');
          break;
      }
    }

    startTimeFrom && queryBuilder.andWhere('voucher.startTime >= :startTimeFrom', { startTimeFrom });
    startTimeTo && queryBuilder.andWhere('voucher.startTime <= :startTimeTo', { startTimeTo });
    endTimeFrom && queryBuilder.andWhere('voucher.endTime >= :endTimeFrom', { endTimeFrom });
    endTimeTo && queryBuilder.andWhere('voucher.endTime <= :endTimeTo', { endTimeTo });

    const items = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();

    return { items, total };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo voucher' })
  async create(@Body() body: CreateVoucherDto, @CurrentUser() user: JwtPayload) {
    const { code } = body;

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const isExist = await manager.findOne(VoucherEntity, { where: { code } });
      if (isExist) throw new ConflictException(EXCEPTIONS.CODE_EXISTED);

      const voucher = new VoucherEntity();
      Object.assign(voucher, body);
      voucher.createdById = user.id;
      voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Unlimited : EMaxDiscountType.Limited;
      return manager.save(voucher);
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật voucher' })
  async update(@Body() body: UpdateVoucherDto, @Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    Object.assign(voucher, body);
    voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Unlimited : EMaxDiscountType.Limited;

    return this.vouchersService.save(voucher);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa voucher' })
  async remove(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    return this.vouchersService.remove(voucher);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết voucher' })
  async findOne(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({
      select: { products: { id: true, name: true } },
      where: { id: id },
      relations: ['products'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher;
  }
}
