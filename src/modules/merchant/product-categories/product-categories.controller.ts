import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';

@Controller('product-categories')
@ApiTags('Product Categories')
@UseGuards(AuthGuard)
export class ProductCategoriesController {
  constructor(private readonly productCategoriesService: ProductCategoriesService) {}

  @Get()
  async find(@CurrentStore() storeId: number, @Query() query: QueryProductCategoryDto) {
    const { limit, page, search, status, includeProducts } = query;

    // return this.productCategoriesService.createQueryBuilder('productCategory').where({ storeId }).getMany();
    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .where({ storeId })
      .orderBy('productCategory.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    search && queryBuilder.andWhere('productCategory.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('productCategory.status = :status', { status });
    includeProducts && queryBuilder.leftJoin('productCategory.products', 'products');

    return queryBuilder.getMany();
  }
}
