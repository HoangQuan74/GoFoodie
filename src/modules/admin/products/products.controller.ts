import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoresService } from '../stores/stores.service';
import { PaginationQuery } from 'src/common/query';
import { DataSource, FindManyOptions, ILike } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { StoreEntity } from 'src/database/entities/store.entity';

@Controller('products')
@ApiTags('Quản lý sản phẩm')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Param('storeId') storeId: number) {
    return this.dataSource.transaction(async (manager) => {
      const store = await manager.findOne(StoreEntity, { where: { id: storeId } });
      if (!store) throw new NotFoundException();

      const lastProduct = await this.productsService.findOne({
        where: { storeId },
        order: { code: 'DESC' },
        withDeleted: true,
      });
      const numberProduct = lastProduct ? +lastProduct.code.slice(-3) + 1 : 1;
      const productCode = `${store.storeCode}${numberProduct.toString().padStart(3, '0')}`;

      const newProduct = new ProductEntity();
      Object.assign(newProduct, createProductDto);
      newProduct.storeId = 111;
      newProduct.code = productCode;

      return manager.save(newProduct);
    });
  }

  @Get()
  async find(@Query() query: PaginationQuery, @Param('storeId') storeId: number) {
    const { page, limit, search } = query;
    const where = search ? { name: ILike(`%${search}%`), storeId } : { storeId };

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
