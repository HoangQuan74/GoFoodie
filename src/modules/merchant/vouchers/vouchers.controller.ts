import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Brackets, DataSource, EntityManager } from 'typeorm';
import { VouchersService } from './vouchers.service';
import { VoucherEntity } from 'src/database/entities/voucher.entity';
import { EXCEPTIONS } from 'src/common/constants';
import { EMaxDiscountType, EVoucherStatus, EVoucherType } from 'src/common/enums/voucher.enum';
import { EServiceType } from 'src/common/enums';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { QueryVoucherDto } from './dto/query-voucher.dto';
import { ProductEntity } from 'src/database/entities/product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('vouchers')
@UseGuards(AuthGuard)
@ApiTags('Quản lý voucher')
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  create(@Body() body: CreateVoucherDto, @CurrentStore() storeId: number) {
    const { code, typeId } = body;

    return this.dataSource.transaction(async (manager: EntityManager) => {
      const isExist = await manager.findOne(VoucherEntity, { where: { code } });
      if (isExist) throw new ConflictException(EXCEPTIONS.CODE_EXISTED);

      const voucher = new VoucherEntity();
      Object.assign(voucher, body);
      voucher.serviceTypeId = EServiceType.Food;
      voucher.createdByStoreId = storeId;
      voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Limited : EMaxDiscountType.Unlimited;

      if (typeId === EVoucherType.Store) {
        Object.assign(voucher, { stores: [{ id: storeId }] });
      }

      return manager.save(voucher);
    });
  }

  @Get()
  async findAll(@Query() query: QueryVoucherDto, @CurrentStore() storeId: number) {
    const { page, limit, search, startTimeFrom, startTimeTo, endTimeFrom, endTimeTo, status } = query;

    const queryBuilder = this.vouchersService
      .createQueryBuilder('voucher')
      .select(['voucher.id as id', 'voucher.code as code', 'voucher.name as name', 'voucher.isActive as "isActive"'])
      .addSelect(['voucher.imageId as "imageId"', 'voucher.createdByStoreId as "createdByStoreId"'])
      .addSelect(['voucher.refundType as "refundType"', 'voucher.minOrderValue as "minOrderValue"'])
      .addSelect(['voucher.maxDiscountValue as "maxDiscountValue"'])
      .addSelect(['voucher.startTime as "startTime"', 'voucher.endTime as "endTime"'])
      .addSelect(['voucher.maxUseTime as "maxUseTime"', 'voucher.maxUseTimePerUser as "maxUseTimePerUser"'])
      .addSelect(['voucher.discountType as "discountType"', 'voucher.discountValue as "discountValue"'])
      .addSelect(['createdBy.name as "createdByName"', 'voucher.createdAt as "createdAt"'])
      .addSelect(['type.id as "typeId"'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)', 'count')
          .from('voucher_products', 'vp')
          .where('vp.voucher_id = voucher.id')
          .innerJoin(ProductEntity, 'product', 'product.id = vp.product_id AND product.store_id = :storeId')
          .setParameter('storeId', storeId);
      }, 'productsCount')
      .addSelect(['0 as "usedCount"'])
      .leftJoin('voucher.createdBy', 'createdBy')
      .leftJoin('voucher.type', 'type')
      .leftJoin('voucher.products', 'products')
      .leftJoin('voucher.stores', 'stores')
      .orderBy('voucher.id', 'DESC')
      .groupBy('voucher.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('type.id')
      .where(
        new Brackets((qb) => {
          qb.where('voucher.createdByStoreId = :storeId', { storeId });
          qb.orWhere('products.storeId = :storeId', { storeId });
          qb.orWhere('stores.id = :storeId', { storeId });
        }),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('voucher.code ILIKE :search', { search: `%${search}%` });
          qb.orWhere('voucher.name ILIKE :search', { search: `%${search}%` });
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

  @Patch(':id')
  async update(@Body() body: UpdateVoucherDto, @Param('id') id: number, @CurrentStore() storeId: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id, createdByStoreId: storeId } });
    if (!voucher) throw new NotFoundException();

    Object.assign(voucher, body);
    voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Limited : EMaxDiscountType.Unlimited;

    return this.vouchersService.save(voucher);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @CurrentStore() storeId: number) {
    const voucher = await this.vouchersService.findOne({ where: { id, createdByStoreId: storeId } });
    if (!voucher) throw new NotFoundException();

    return this.vouchersService.remove(voucher);
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @CurrentStore() storeId: number) {
    const voucher = await this.vouchersService.findOne({
      select: {
        products: { id: true, name: true },
      },
      where: [{ id, createdByStoreId: storeId }, { stores: { id: storeId } }, { products: { storeId } }],
      relations: ['products'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher;
  }

  @Patch(':id/end')
  async endVoucher(@Param('id') id: number, @CurrentStore() storeId: number) {
    const voucher = await this.vouchersService.findOne({ where: [{ id, createdByStoreId: storeId }] });
    if (!voucher) throw new NotFoundException();

    voucher.endTime = new Date();
    return this.vouchersService.save(voucher);
  }
}
