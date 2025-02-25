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

@Controller('flash-sales')
@ApiTags('Flash Sales')
@UseGuards(AuthGuard)
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  @Post()
  create(@Body() body: CreateFlashSaleDto, @CurrentStore() storeId: number) {
    return this.flashSalesService.save({ ...body, createdByStoreId: storeId });
  }

  @Get('time-frames')
  @ApiOperation({ summary: 'Lấy danh sách khung giờ flash sale' })
  getTimeFrames() {
    return this.flashSalesService.getTimeFrames({ order: { startTime: 'ASC' } });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách flash sale' })
  async find(@Query() query: QueryFlashSaleDto, @CurrentStore() storeId: number) {
    const { limit, page, search, createdAtFrom, createdAtTo, status } = query;

    const queryBuilder = this.flashSalesService
      .createQueryBuilder('flashSale')
      .select([
        'flashSale.id as id',
        'flashSale.name as name',
        'flashSale.startDate as "startDate"',
        'flashSale.endDate as "endDate"',
        'timeFrame.startTime as "startTime"',
        'timeFrame.endTime as "endTime"',
      ])
      .addSelect('COUNT(DISTINCT flashSaleProduct.id)', 'totalProducts')
      .innerJoin('flashSale.timeFrame', 'timeFrame')
      .leftJoin('flashSale.products', 'flashSaleProduct')
      .leftJoin('flashSaleProduct.product', 'product')
      .where(
        new Brackets((qb) => {
          qb.where('flashSale.createdByStoreId = :storeId', { storeId });
          qb.orWhere('product.storeId = :storeId', { storeId });
        }),
      )
      .orderBy('flashSale.id', 'DESC')
      .groupBy('flashSale.id')
      .addGroupBy('timeFrame.id')
      .limit(limit)
      .offset(limit * (page - 1));

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

    const items = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const flashSale = await this.flashSalesService.findOne({
      where: { id: id },
      relations: ['timeFrame'],
    });
    if (!flashSale) throw new NotFoundException();

    return flashSale;
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentStore() storeId: number) {
    const flashSale = await this.flashSalesService.findOne({ where: { id, createdByStoreId: storeId } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.remove(flashSale);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body: UpdateFlashSaleDto, @CurrentStore() storeId: number) {
    const flashSale = await this.flashSalesService.findOne({ where: { id, createdByStoreId: storeId } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.save({ ...flashSale, ...body });
  }

  @Get(':id/products')
  async getProducts(
    @Param('id') id: number,
    @Query() query: QueryFlashSaleProductsDto,
    @CurrentStore() storeId: number,
  ) {
    const { limit, page } = query;

    const queryBuilder = this.flashSalesService
      .createQueryBuilderProducts('flashSaleProduct')
      .addSelect(['product.id', 'product.name', 'product.price', 'product.imageId', 'product.code'])
      .addSelect(['productCategory.id', 'productCategory.name'])
      .addSelect(['serviceGroup.id', 'serviceGroup.name'])
      .leftJoin('flashSaleProduct.product', 'product')
      .leftJoin('product.productCategory', 'productCategory')
      .leftJoin('productCategory.serviceGroup', 'serviceGroup')
      .where('flashSaleProduct.flashSaleId = :flashSaleId', { flashSaleId: id })
      .andWhere('product.storeId = :storeId', { storeId: storeId })
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
