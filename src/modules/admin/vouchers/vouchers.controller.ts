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
    const { page, limit, search, startTimeFrom, startTimeTo, endTimeFrom, endTimeTo, status, typeId } = query;

    const queryBuilder = this.vouchersService
      .createQueryBuilder('voucher')
      .select(['voucher.id as id', 'voucher.code as code', 'voucher.name as name', 'voucher.isActive as "isActive"'])
      .addSelect(['voucher.startTime as "startTime"', 'voucher.endTime as "endTime"'])
      .addSelect(['voucher.maxUseTime as "maxUseTime"', 'voucher.maxUseTimePerUser as "maxUseTimePerUser"'])
      .addSelect(['voucher.discountType as "discountType"', 'voucher.discountValue as "discountValue"'])
      .addSelect(['createdBy.name as "createdByName"', 'voucher.createdAt as "createdAt"'])
      .addSelect(['serviceType.name as "serviceTypeName"'])
      .addSelect(['type.id as "typeId"', 'type.name as "typeName"'])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(1)', 'count')
          .from('voucher_products', 'vp')
          .where('vp.voucher_id = voucher.id')
          .innerJoin(ProductEntity, 'product', 'product.id = vp.product_id');
      }, 'productsCount')
      .addSelect((subQuery) => {
        return subQuery.select('COUNT(1)', 'count').from('voucher_stores', 'vs').where('vs.voucher_id = voucher.id');
      }, 'storesCount')
      .addSelect(['0 as "usedCount"'])
      .leftJoin('voucher.createdBy', 'createdBy')
      .leftJoin('voucher.serviceType', 'serviceType')
      .leftJoin('voucher.type', 'type')
      .leftJoin('voucher.products', 'products')
      .where('voucher.createdByStoreId IS NULL')
      .orderBy('voucher.id', 'DESC')
      .groupBy('voucher.id')
      .addGroupBy('createdBy.id')
      .addGroupBy('serviceType.id')
      .addGroupBy('type.id')
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
    typeId && queryBuilder.andWhere('voucher.type_id = :typeId', { typeId });

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
      voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Limited : EMaxDiscountType.Unlimited;
      return manager.save(voucher);
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật voucher' })
  async update(@Body() body: UpdateVoucherDto, @Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    Object.assign(voucher, body);
    voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Limited : EMaxDiscountType.Unlimited;

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
      select: {
        products: { id: true, name: true },
        stores: { id: true, name: true, storeCode: true, serviceGroup: { id: true, name: true } },
      },
      where: { id: id },
      relations: ['products', 'stores', 'stores.serviceGroup'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher;
  }

  @Get(':id/stores')
  @ApiOperation({ summary: 'Danh sách cửa hàng được áp dụng voucher' })
  async getStores(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({
      select: { id: true, stores: { id: true, name: true, storeCode: true, serviceGroup: { id: true, name: true } } },
      where: { id: id },
      relations: ['stores', 'stores.serviceGroup'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher.stores;
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Danh sách sản phẩm được áp dụng voucher' })
  async getProducts(@Param('id') id: number) {
    const voucher = await this.vouchersService.findOne({
      select: { products: { id: true, name: true } },
      where: { id: id },
      relations: ['products'],
    });
    if (!voucher) throw new NotFoundException();

    return voucher.products;
  }

  @Delete(':id/products/:productId')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi voucher' })
  async removeProduct(@Param('id') id: number, @Param('productId') productId: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    await this.vouchersService.removeProduct(voucher, productId);
  }

  @Delete(':id/stores/:storeId')
  @ApiOperation({ summary: 'Xóa cửa hàng khỏi voucher' })
  async removeStore(@Param('id') id: number, @Param('storeId') storeId: number) {
    const voucher = await this.vouchersService.findOne({ where: { id: id } });
    if (!voucher) throw new NotFoundException();

    await this.vouchersService.removeStore(voucher, storeId);
  }
}
