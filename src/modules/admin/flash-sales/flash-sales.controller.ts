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
  Query,
  ConflictException,
} from '@nestjs/common';
import { FlashSalesService } from './flash-sales.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryFlashSaleProductsDto } from './dto/query-flash-sale-products.dto';
import { AddFlashSaleProductsDto } from './dto/add-flash-sale-products.dto';
import { UpdateFlashSaleProductsDto } from './dto/update-flash-sale-products.dto';
import { IdentityQuery } from 'src/common/query';
import { In } from 'typeorm';

@Controller('flash-sales')
@ApiTags('Admin Flash Sales')
@UseGuards(AuthGuard)
export class FlashSalesController {
  constructor(private readonly flashSalesService: FlashSalesService) {}

  @Post()
  create(@Body() body: CreateFlashSaleDto) {
    return this.flashSalesService.save(body);
  }

  @Get('time-frames')
  @ApiOperation({ summary: 'Lấy danh sách khung giờ flash sale' })
  getTimeFrames() {
    return this.flashSalesService.getTimeFrames({ order: { startTime: 'ASC' } });
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách flash sale' })
  async find(@Query() query: QueryFlashSaleProductsDto) {
    const { limit, page, search } = query;

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
      .addSelect('COUNT(DISTINCT product.storeId)', 'totalStores')
      .addSelect('COUNT(DISTINCT store.serviceGroupId)', 'totalServiceGroups')
      .innerJoin('flashSale.timeFrame', 'timeFrame')
      .leftJoin('flashSale.products', 'flashSaleProduct')
      .leftJoin('flashSaleProduct.product', 'product')
      .leftJoin('product.store', 'store')
      .orderBy('flashSale.id', 'DESC')
      .groupBy('flashSale.id')
      .addGroupBy('timeFrame.id')
      .limit(limit)
      .offset(limit * (page - 1));

    search && queryBuilder.andWhere('flashSale.name ILIKE :search', { search: `%${search}%` });

    const items = await queryBuilder.getRawMany();
    const total = await queryBuilder.getCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const flashSale = await this.flashSalesService.findOne({ where: { id: +id }, relations: ['timeFrame'] });
    if (!flashSale) throw new NotFoundException();

    return flashSale;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const flashSale = await this.flashSalesService.findOne({ where: { id: +id } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.remove(flashSale);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateFlashSaleDto) {
    const flashSale = await this.flashSalesService.findOne({ where: { id: +id } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.save({ ...flashSale, ...body });
  }

  @Get(':id/products')
  async getProducts(@Param('id') id: number, @Query() query: QueryFlashSaleProductsDto) {
    const { limit, page } = query;
    const options = { where: { flashSaleId: id }, skip: limit * (page - 1), take: limit };

    const [items, total] = await this.flashSalesService.findAndCountProducts(options);
    return { items, total };
  }

  @Post(':id/products')
  async addProducts(@Param('id') flashSaleId: number, @Body() body: AddFlashSaleProductsDto) {
    const { products } = body;

    const flashSale = await this.flashSalesService.findOne({ where: { id: flashSaleId } });
    if (!flashSale) throw new NotFoundException();

    const data = products.map((product) => ({ flashSaleId, ...product }));
    const productIds = products.map((p) => p.productId);
    if (new Set(productIds).size !== productIds.length) throw new ConflictException();

    const countProducts = await this.flashSalesService.countProducts({ flashSaleId, productId: In(productIds) });
    if (countProducts) throw new ConflictException();

    return this.flashSalesService.saveProducts(data);
  }

  @Delete(':id/products')
  async removeProducts(@Param('id') id: number, @Body() { ids }: IdentityQuery) {
    const flashSaleProducts = await this.flashSalesService.findProducts({ where: { flashSaleId: id, id: In(ids) } });
    if (flashSaleProducts.length !== ids.length) throw new NotFoundException();

    return this.flashSalesService.removeProducts(flashSaleProducts);
  }

  @Patch(':id/products')
  async updateProducts(@Param('id') id: number, @Body() body: UpdateFlashSaleProductsDto) {
    const { products } = body;

    const flashSale = await this.flashSalesService.findOne({ where: { id } });
    if (!flashSale) throw new NotFoundException();

    return this.flashSalesService.saveProducts(products);
  }
}
