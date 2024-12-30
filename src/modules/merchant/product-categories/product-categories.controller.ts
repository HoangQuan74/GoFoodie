import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { Brackets, IsNull } from 'typeorm';
import { StoresService } from '../stores/stores.service';

@Controller('product-categories')
@ApiTags('Product Categories')
@UseGuards(AuthGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
  ) {}

  @Get('global')
  async getGlobalCategories(@Query('serviceGroupId') serviceGroupId: number) {
    const options = { where: { serviceGroupId, storeId: IsNull() } };
    const [items, total] = await this.productCategoriesService.find(options);

    return { items, total };
  }

  @Get()
  async find(@CurrentStore() storeId: number, @Query() query: QueryProductCategoryDto) {
    const { limit, page, search, status, productStatus } = query;
    const store = await this.storesService.findOne({
      select: { id: true, serviceGroupId: true },
      where: { id: storeId },
    });
    if (!store) return [];

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .select(['productCategory.id', 'productCategory.name', 'productCategory.storeId'])
      // .addSelect((subQuery) => {
      //   return subQuery
      //     .select('COUNT(product.id)', 'totalProducts')
      //     .from('products', 'product')
      //     .where('product.productCategoryId = productCategory.id')
      //     .andWhere('product.status = :productStatus', { productStatus });
      // }, 'totalProducts')
      .loadRelationCountAndMap('productCategory.totalProducts', 'productCategory.products', 'products', (qb) => {
        return qb.andWhere('products.status = :productStatus', { productStatus });
      })
      .where(
        new Brackets((qb) => {
          qb.where('productCategory.storeId = :storeId', { storeId });
          qb.orWhere('stores.id = :storeId', { storeId });
        }),
      )
      .leftJoin('productCategory.stores', 'stores')
      .orderBy('productCategory.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    search && queryBuilder.andWhere('productCategory.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('productCategory.status = :status', { status });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }
}
