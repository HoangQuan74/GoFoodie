import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ConflictException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { AddFlashSaleProductsDto } from './dto/add-flash-sale-products.dto';
import { QueryFlashSaleProductsDto } from './dto/query-flash-sale-products.dto';
import { EFlashSaleStatus } from 'src/common/enums';
import { Brackets, In } from 'typeorm';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlashSaleDto } from './dto/query-flash-sale.dto';
import { IdentityQuery } from 'src/common/query';
import * as moment from 'moment-timezone';
import { TIMEZONE } from 'src/common/constants';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { ProductCategoriesService } from '../product-categories/product-categories.service';

@Controller('flash-sales')
@ApiTags('Flash Sales')
@UseGuards(AuthGuard)
export class FlashSalesController {
  constructor(
    private readonly flashSalesService: FlashSalesService,
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Post()
  create(@Body() body: CreateFlashSaleDto, @CurrentStore() storeId: number) {
    return this.flashSalesService.save({ ...body, createdByStoreId: storeId });
  }

  @Get('time-frames')
  @ApiOperation({ summary: 'Lấy danh sách khung giờ flash sale theo ngày' })
  getTimeFrames(@Query('date') date: Date, @CurrentStore() storeId: number) {
    const queryBuilder = this.flashSalesService
      .createQueryBuilderTimeFrames('timeFrame')
      .orderBy('timeFrame.startTime', 'ASC');

    if (date) {
      const currentDay = moment().tz(TIMEZONE).format('YYYY-MM-DD');
      const currentTime = moment().tz(TIMEZONE).format('HH:mm:ss');
      const dateFormatted = moment(date).tz(TIMEZONE).format('YYYY-MM-DD');

      queryBuilder
        .leftJoin(
          'timeFrame.flashSales',
          'flashSale',
          'flashSale.createdByStoreId = :storeId AND flashSale.startDate = :startDate',
        )
        .where('flashSale.id IS NULL')
        .setParameters({ storeId, startDate: dateFormatted });

      if (dateFormatted === currentDay) {
        queryBuilder.andWhere('timeFrame.startTime > :currentTime', { currentTime });
      }
    }

    return queryBuilder.getMany();
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách flash sale' })
  async find(@Query() query: QueryFlashSaleDto, @CurrentStore() storeId: number) {
    const { limit, page, search, createdAtFrom, createdAtTo, status } = query;

    const queryBuilder = this.flashSalesService
      .createQueryBuilder('flashSale')
      .select([
        'flashSale.id',
        'flashSale.name',
        'flashSale.startDate',
        'flashSale.endDate',
        'flashSale.status',
        'timeFrame.startTime',
        'timeFrame.endTime',
      ])
      .innerJoin('flashSale.timeFrame', 'timeFrame')
      .addSelect(['flashSaleProduct.id', 'flashSaleProduct.productId'])
      .addSelect(['product.id', 'product.name', 'product.imageId'])
      .leftJoin('flashSale.products', 'flashSaleProduct')
      .leftJoin('flashSaleProduct.product', 'product')
      .where(
        new Brackets((qb) => {
          qb.where('flashSale.createdByStoreId = :storeId', { storeId });
          qb.orWhere('product.storeId = :storeId', { storeId });
        }),
      )
      .orderBy('flashSale.id', 'DESC')
      .skip(limit * (page - 1))
      .take(limit);

    search && queryBuilder.andWhere('flashSale.name ILIKE :search', { search: `%${search}%` });

    if (createdAtFrom && createdAtTo) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qb) => {
              qb.where('flashSale.startDate >= :createdAtFrom', { createdAtFrom });
              qb.andWhere('flashSale.startDate <= :createdAtTo', { createdAtTo });
            }),
          );
          qb.orWhere(
            new Brackets((qb) => {
              qb.where('flashSale.endDate >= :createdAtFrom', { createdAtFrom });
              qb.andWhere('flashSale.endDate <= :createdAtTo', { createdAtTo });
            }),
          );
        }),
      );
    }

    if (status) {
      const currentDay = moment().tz(TIMEZONE).format('YYYY-MM-DD');
      const currentTime = moment().tz(TIMEZONE).format('HH:mm:ss');

      switch (status) {
        case EFlashSaleStatus.NotStarted:
          queryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where(
                new Brackets((qb) => {
                  qb.where('flashSale.endDate > :currentDay');
                  qb.andWhere(
                    new Brackets((qb) => {
                      qb.where('timeFrame.startTime > :currentTime');
                      qb.orWhere('timeFrame.endTime < :currentTime');
                    }),
                  );
                }),
              );
              qb.orWhere(
                new Brackets((qb) => {
                  qb.where('flashSale.endDate = :currentDay');
                  qb.andWhere('timeFrame.startTime > :currentTime');
                }),
              );
              qb.orWhere('flashSale.startDate > :currentDay');
            }),
          );
          break;
        case EFlashSaleStatus.InProgress:
          queryBuilder.andWhere('flashSale.startDate <= :currentDay');
          queryBuilder.andWhere('flashSale.endDate >= :currentDay');
          queryBuilder.andWhere('timeFrame.startTime <= :currentTime');
          queryBuilder.andWhere('timeFrame.endTime >= :currentTime');
          break;
        case EFlashSaleStatus.Ended:
          queryBuilder.andWhere(
            new Brackets((qb) => {
              qb.where('flashSale.endDate < :currentDay');
              qb.orWhere('flashSale.endDate <= :currentDay AND timeFrame.endTime < :currentTime');
            }),
          );
          break;
      }

      queryBuilder.setParameters({ currentDay, currentTime });
    }

    const items = await queryBuilder.getMany();
    const total = await queryBuilder.getCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const { raw, entities } = await this.flashSalesService
      .createQueryBuilder('flashSale')
      .addSelect(`MAX("flashSaleProduct"."limit_quantity")`, 'maxLimitQuantity')
      .addSelect(`MIN("flashSaleProduct"."limit_quantity")`, 'minLimitQuantity')
      .addSelect(`MAX("flashSaleProduct"."product_quantity")`, 'maxProductQuantity')
      .addSelect(`MIN("flashSaleProduct"."product_quantity")`, 'minProductQuantity')
      .addSelect(`MIN("flashSaleProduct"."discount")`, 'minDiscount')
      .addSelect(`MAX("flashSaleProduct"."discount")`, 'maxDiscount')
      .addSelect(`MAX("flashSaleProduct"."price")`, 'maxPrice')
      .where('flashSale.id = :id', { id })
      .innerJoinAndSelect('flashSale.timeFrame', 'timeFrame')
      .leftJoin('flashSale.products', 'flashSaleProduct')
      .groupBy('flashSale.id')
      .addGroupBy('timeFrame.id')
      .getRawAndEntities();

    if (!entities.length) throw new NotFoundException();

    return {
      ...entities[0],
      minLimitQuantity: raw[0].minLimitQuantity,
      maxLimitQuantity: raw[0].maxLimitQuantity,
      maxProductQuantity: raw[0].maxProductQuantity,
      minProductQuantity: raw[0].minProductQuantity,
      minDiscount: raw[0].minDiscount,
      maxDiscount: raw[0].maxDiscount,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentStore() storeId: number) {
    const currentDay = moment().tz(TIMEZONE).format('YYYY-MM-DD');
    const currentTime = moment().tz(TIMEZONE).format('HH:mm:ss');

    const flashSale = await this.flashSalesService
      .createQueryBuilder('flashSale')
      .innerJoin('flashSale.timeFrame', 'timeFrame')
      .where('flashSale.id = :id', { id })
      .andWhere('flashSale.createdByStoreId = :storeId', { storeId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qb) => {
              qb.where('flashSale.endDate > :currentDay');
              qb.andWhere(
                new Brackets((qb) => {
                  qb.where('timeFrame.startTime > :currentTime');
                  qb.orWhere('timeFrame.endTime < :currentTime');
                }),
              );
            }),
          );
          qb.orWhere(
            new Brackets((qb) => {
              qb.where('flashSale.endDate = :currentDay');
              qb.andWhere('timeFrame.startTime > :currentTime');
            }),
          );
          qb.orWhere('flashSale.startDate > :currentDay');
        }),
      )
      .setParameters({ currentDay, currentTime })
      .getOne();
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.remove(flashSale);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateFlashSaleDto, @CurrentStore() storeId: number) {
    const flashSale = await this.flashSalesService.findOne({ where: { id, createdByStoreId: storeId } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.save({ ...flashSale, ...body });
  }

  @Patch(':id/end')
  async end(@Param('id') id: number, @CurrentStore() storeId: number) {
    const currentDay = moment().tz(TIMEZONE).format('YYYY-MM-DD');
    const yesterday = moment().tz(TIMEZONE).subtract(1, 'days').format('YYYY-MM-DD');
    const currentTime = moment().tz(TIMEZONE).format('HH:mm:ss');

    const flashSale = await this.flashSalesService
      .createQueryBuilder('flashSale')
      .innerJoinAndSelect('flashSale.timeFrame', 'timeFrame')
      .where('flashSale.id = :id', { id })
      .andWhere('flashSale.createdByStoreId = :storeId', { storeId })
      .getOne();
    if (!flashSale) throw new NotFoundException();

    const isPassedTimeFrame = flashSale.timeFrame.endTime < currentTime;
    const endDate = isPassedTimeFrame ? currentDay : yesterday;

    return this.flashSalesService.save({ ...flashSale, endDate });
  }

  @Get(':id/products')
  async getProducts(
    @Param('id') id: number,
    @Query() query: QueryFlashSaleProductsDto,
    @CurrentStore() storeId: number,
  ) {
    const { limit, page } = query;

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .select(['productCategory.id', 'productCategory.name'])
      .addSelect(['product.id', 'product.name', 'product.price', 'product.imageId', 'product.code'])
      .innerJoin('productCategory.products', 'product')
      .innerJoinAndMapOne(
        'product.flashSaleProduct',
        'product.flashSaleProducts',
        'flashSaleProduct',
        'flashSaleProduct.flashSaleId = :flashSaleId',
        { flashSaleId: id },
      )
      .where('product.storeId = :storeId', { storeId })
      .skip(limit * (page - 1))
      .take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Post(':id/products')
  async addProducts(
    @Param('id') flashSaleId: number,
    @Body() body: AddFlashSaleProductsDto,
    @CurrentStore() storeId: number,
  ) {
    const { products } = body;

    const flashSale = await this.flashSalesService.findOne({ where: { id: flashSaleId, createdByStoreId: storeId } });
    if (!flashSale) throw new NotFoundException();

    const data = products.map((product) => ({ flashSaleId, ...product }));
    const productIds = products.map((p) => p.productId);
    if (new Set(productIds).size !== productIds.length) throw new ConflictException();

    const countProducts = await this.flashSalesService.countProducts({ flashSaleId, productId: In(productIds) });
    if (countProducts) throw new ConflictException();

    return this.flashSalesService.saveProducts(data);
  }

  @Delete(':id/products')
  async removeProducts(@Param('id') id: number, @Body() { ids }: IdentityQuery, @CurrentStore() storeId: number) {
    const flashSale = await this.flashSalesService.findOne({ where: { id, createdByStoreId: storeId } });
    if (!flashSale) throw new NotFoundException();

    const flashSaleProducts = await this.flashSalesService.findProducts({ where: { flashSaleId: id, id: In(ids) } });
    if (flashSaleProducts.length !== ids.length) throw new NotFoundException();

    return this.flashSalesService.removeProducts(flashSaleProducts);
  }
}
