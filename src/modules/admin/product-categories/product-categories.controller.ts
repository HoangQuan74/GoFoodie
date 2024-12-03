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

  @Get()
  async find(@Query() query: QueryProductCategoryDto) {
    const { page, limit, search, storeId, status } = query;

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(product.id)', 'totalProducts')
          .from('products', 'product')
          .where('product.productCategoryId = productCategory.id');
      }, 'totalProducts')
      .where(
        new Brackets((qb) => {
          qb.where('productCategory.storeId IS NULL');
          storeId && qb.orWhere('productCategory.storeId = :storeId', { storeId });
        }),
      );

    if (search) {
      queryBuilder.andWhere('productCategory.name ILIKE :search', { search: `%${search}%` });
    }

    status && queryBuilder.andWhere('productCategory.status = :status', { status });

    const { raw, entities } = await queryBuilder
      .orderBy('productCategory.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const total = await queryBuilder.getCount();

    entities.forEach((entity) => {
      const totalProducts = raw.find((item) => item.productCategory_id === entity.id).totalProducts;
      entity.totalProducts = totalProducts;
    });

    return { items: entities, total };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    const productCategory = await this.productCategoriesService.findOne({ where: { id: +id } });
    if (!productCategory) throw new NotFoundException();

    return this.productCategoriesService.save({ ...productCategory, ...updateProductCategoryDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.dataSource.transaction(async (manager) => {
      const productCategory = await manager.findOne(ProductCategoryEntity, { where: { id: +id } });
      if (!productCategory) throw new NotFoundException();

      const totalProducts = await manager.count(ProductEntity, { where: { id: +id } });
      if (totalProducts > 0) throw new ConflictException(EXCEPTIONS.CATEGORY_HAS_PRODUCTS);

      return manager.softDelete(ProductCategoryEntity, { id: +id });
    });
  }
}
