import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { StoresService } from '../stores/stores.service';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Brackets, DataSource } from 'typeorm';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { ProductEntity } from 'src/database/entities/product.entity';
import { EXCEPTIONS } from 'src/common/constants';
import { EProductCategoryStatus, EProductStatus } from 'src/common/enums';

@Controller('product-categories')
@ApiTags('Quản lý danh mục sản phẩm')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    const productCategory = await this.productCategoriesService.save(createProductCategoryDto);
    const productCategoryCode = `${productCategory.id.toString().padStart(4, '0')}`;
    productCategory.code = productCategoryCode;
    return this.productCategoriesService.save(productCategory);
  }

  @Get('list')
  async list(@Query() query: QueryProductCategoryDto) {
    const { storeId, status, search } = query;
    if (!storeId) throw new BadRequestException(EXCEPTIONS.STORE_ID_REQUIRED);

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('category')
      .select(['category.id', 'category.name', 'category.status'])
      .addSelect(['products.id', 'products.name'])
      .where(
        new Brackets((qb) => {
          qb.where('category.storeId = :storeId').orWhere('category.storeId IS NULL');
        }),
      )
      .leftJoin('category.products', 'products', 'products.status = :productStatus AND products.storeId = :storeId')
      .setParameter('productStatus', EProductStatus.Active)
      .setParameter('storeId', storeId);

    status && queryBuilder.andWhere('category.status = :status', { status });
    search && queryBuilder.andWhere('products.name ILIKE :search', { search: `%${search}%` });

    return queryBuilder.getMany();
  }

  @Get()
  async find(@Query() query: QueryProductCategoryDto) {
    const { page, limit, search, storeId, status } = query;

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('category')
      .select([
        'category.id as id',
        'category.code as code',
        'category.name as name',
        'category.description as description',
        'category.status as status',
        'category.createdAt as createdAt',
        'category.updatedAt as updatedAt',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(product.id)', 'totalProducts')
          .from('products', 'product')
          .where('product.productCategoryId = category.id');
      }, 'totalProducts')
      .where(
        new Brackets((qb) => {
          qb.where('category.storeId IS NULL');
          storeId && qb.orWhere('category.storeId = :storeId', { storeId });
        }),
      );

    search && queryBuilder.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('category.status = :status', { status });

    const items = await queryBuilder
      .orderBy('category.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawMany();

    const total = await queryBuilder.getCount();
    return { items, total };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    const productCategory = await this.productCategoriesService.findOne({ where: { id: +id } });
    if (!productCategory) throw new NotFoundException();

    return this.productCategoriesService.save({ ...productCategory, ...updateProductCategoryDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.dataSource.transaction(async (manager) => {
      const category = await manager.findOneBy(ProductCategoryEntity, { id, status: EProductCategoryStatus.Inactive });
      if (!category) throw new NotFoundException();

      const totalProducts = await manager.count(ProductEntity, { where: { id: +id } });
      if (totalProducts > 0) throw new ConflictException(EXCEPTIONS.CATEGORY_HAS_PRODUCTS);

      return manager.softDelete(ProductCategoryEntity, { id: +id });
    });
  }
}
