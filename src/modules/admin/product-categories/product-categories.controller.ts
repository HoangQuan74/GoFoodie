import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { StoresService } from '../stores/stores.service';
import { PaginationQuery } from 'src/common/query';
import { ApiTags } from '@nestjs/swagger';
import { Brackets } from 'typeorm';

@Controller('product-categories')
@ApiTags('Quản lý danh mục sản phẩm')
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  async create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoriesService.save(createProductCategoryDto);
  }

  @Get()
  async find(@Query() query: PaginationQuery, @Query('storeId') storeId?: number) {
    const { page, limit, search } = query;

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

    const { raw, entities } = await queryBuilder
      .orderBy('productCategory.createdAt', 'DESC')
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
    const productCategory = await this.productCategoriesService.findOne({ where: { id: +id } });
    if (!productCategory) throw new NotFoundException();

    return this.productCategoriesService.remove(productCategory);
  }
}
