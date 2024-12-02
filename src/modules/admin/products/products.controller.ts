import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoresService } from '../stores/stores.service';
import { PaginationQuery } from 'src/common/query';
import { FindManyOptions, ILike } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';

@Controller('products')
@ApiTags('Quản lý sản phẩm')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Param('storeId') storeId: number) {
    const store = await this.storesService.findOne({ where: { id: storeId } });
    if (!store) throw new NotFoundException();

    return this.productsService.save({ ...createProductDto, store });
  }

  @Get()
  async find(@Query() query: PaginationQuery) {
    const { page, limit, search } = query;
    const where = search ? { name: ILike(`%${search}%`) } : {};
    const options: FindManyOptions<ProductEntity> = {
      select: { productCategory: { id: true, name: true } },
      skip: (page - 1) * limit,
      take: limit,
      where,
      relations: { productCategory: true },
      order: { createdAt: 'DESC' },
    };

    const [items, total] = await this.productsService.findAndCount(options);
    return { items, total };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne({ where: { id: +id } });
    if (!product) throw new NotFoundException();

    return product;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.findOne({ where: { id: +id } });
    if (!product) throw new NotFoundException();

    return this.productsService.save({ ...product, ...updateProductDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.findOne({ where: { id: +id } });
    if (!product) throw new NotFoundException();

    return this.productsService.remove(product);
  }
}
