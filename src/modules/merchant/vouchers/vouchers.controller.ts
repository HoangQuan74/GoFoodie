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
import { AuthGuard } from '../auth/auth.guard';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductCategoriesService } from '../product-categories/product-categories.service';
import { generateRandomString } from 'src/utils/bcrypt';

@Controller('vouchers')
@UseGuards(AuthGuard)
@ApiTags('Quản lý voucher')
export class VouchersController {
  constructor(
    private readonly vouchersService: VouchersService,
    private readonly dataSource: DataSource,
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  create(@Body() body: CreateVoucherDto, @CurrentStore() storeId: number) {
    let { code } = body;
    const { typeId } = body;

    return this.dataSource.transaction(async (manager: EntityManager) => {
      if (code) {
        const isExist = await manager.findOne(VoucherEntity, { where: { code } });
        if (isExist) throw new ConflictException(EXCEPTIONS.CODE_EXISTED);
      } else {
        code = generateRandomString(6, true);
      }

      const voucher = new VoucherEntity();
      Object.assign(voucher, body);
      voucher.serviceTypeId = EServiceType.Food;
      voucher.createdByStoreId = storeId;
      voucher.maxDiscountType = voucher.maxDiscountValue ? EMaxDiscountType.Limited : EMaxDiscountType.Unlimited;
      voucher.code = code;

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
      .leftJoin('voucher.products', 'products')
      .leftJoin('voucher.stores', 'stores')
      .orderBy('voucher.id', 'DESC')
      .where(
        new Brackets((qb) => {
          qb.where('voucher.createdByStoreId = :storeId', { storeId });
          qb.orWhere('products.storeId = :storeId', { storeId });
          qb.orWhere('stores.id = :storeId', { storeId });
        }),
      )
      .take(limit)
      .skip((page - 1) * limit);

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

    const [items, total] = await queryBuilder.getManyAndCount();

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
        products: { id: true, name: true, price: true, imageId: true, productCategory: { id: true, name: true } },
      },
      where: [
        { id, createdByStoreId: storeId },
        { id, stores: { id: storeId } },
        { id, products: { storeId } },
      ],
      relations: { products: { productCategory: true } },
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

  @Get(':id/products')
  async getProducts(@Param('id') id: number, @CurrentStore() storeId: number) {
    return this.productCategoriesService
      .createQueryBuilder('category')
      .select(['category.id', 'category.name'])
      .addSelect(['products.id', 'products.name', 'products.price', 'products.imageId'])
      .innerJoin('category.products', 'products')
      .innerJoin('products.vouchers', 'vouchers')
      .where('vouchers.id = :id', { id })
      .andWhere('products.storeId = :storeId', { storeId })
      .getMany();
  }
}
