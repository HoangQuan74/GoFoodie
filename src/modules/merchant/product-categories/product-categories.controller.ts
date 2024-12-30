import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CurrentStore } from 'src/common/decorators/current-store.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { Brackets, IsNull, Not } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { EProductCategoryStatus } from 'src/common/enums';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { EXCEPTIONS } from 'src/common/constants';

@Controller('product-categories')
@ApiTags('Product Categories')
@UseGuards(AuthGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
  ) {}

  @Post()
  async create(@CurrentStore() storeId: number, @Body() body: CreateProductCategoryDto) {
    const store = await this.storesService.findOne({
      select: { id: true, serviceGroupId: true },
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException();

    const { parentId, name } = body;

    if (!parentId) {
      const isExist = await this.productCategoriesService.findOne({
        where: [
          { name, storeId },
          { name, storeId: IsNull() },
        ],
      });

      if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);
      return this.productCategoriesService.save({ name, storeId, serviceGroupId: store.serviceGroupId });
    } else {
      const parent = await this.productCategoriesService.findOne({ where: { id: parentId }, relations: ['stores'] });
      if (!parent) throw new NotFoundException();

      const isExist = await this.productCategoriesService.findOne({ where: { id: parentId, stores: { id: storeId } } });
      if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

      return this.productCategoriesService
        .createQueryBuilder('productCategory')
        .relation('stores')
        .of(parent)
        .add(storeId);
    }
  }

  @Get('global')
  async getGlobalCategories(@Query('serviceGroupId') serviceGroupId: number) {
    const select = { id: true, name: true };
    const options = { select, where: { serviceGroupId, storeId: IsNull(), status: EProductCategoryStatus.Active } };
    const [items, total] = await this.productCategoriesService.findAndCount(options);

    return { items, total };
  }

  @Get()
  async find(@CurrentStore() storeId: number, @Query() query: QueryProductCategoryDto) {
    const { limit, page, search, status, productStatus, includeProducts, approvalStatus } = query;
    const store = await this.storesService.findOne({
      select: { id: true, serviceGroupId: true },
      where: { id: storeId },
    });
    if (!store) return [];

    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .select(['productCategory.id', 'productCategory.name', 'productCategory.storeId'])
      .loadRelationCountAndMap('productCategory.totalProducts', 'productCategory.products', 'products', (qb) => {
        return qb
          .andWhere('products.status = :productStatus', { productStatus })
          .andWhere('products.storeId = :storeId', { storeId });
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
    productStatus && queryBuilder.andWhere('products.status = :productStatus', { productStatus });
    approvalStatus && queryBuilder.andWhere('products.approvalStatus = :approvalStatus', { approvalStatus });

    if (includeProducts) {
      queryBuilder.addSelect(['products.id', 'products.name', 'products.status']);
      queryBuilder.leftJoin('productCategory.products', 'products');
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  @Get(':id')
  async findOne(@CurrentStore() storeId: number, @Param('id') id: number) {
    const productCategory = await this.productCategoriesService.findOne({
      where: [
        { id, storeId },
        { id, stores: { id: storeId } },
      ],
    });

    if (!productCategory) throw new NotFoundException();
    return productCategory;
  }

  @Patch(':id')
  async update(@CurrentStore() storeId: number, @Param('id') id: number, @Body() body: UpdateProductCategoryDto) {
    const { name } = body;

    const productCategory = await this.productCategoriesService.findOne({ where: { id, storeId } });
    if (!productCategory) throw new NotFoundException();

    const isExist = await this.productCategoriesService.count({ where: { name, storeId, id: Not(id) } });
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    Object.assign(productCategory, body);
    return this.productCategoriesService.save(productCategory);
  }

  @Delete(':id')
  async remove(@CurrentStore() storeId: number, @Param('id') id: number) {
    const productCategory = await this.productCategoriesService
      .createQueryBuilder('productCategory')
      .loadRelationCountAndMap('productCategory.totalProducts', 'productCategory.products')
      .where('productCategory.id = :id', { id })
      .andWhere('productCategory.storeId = :storeId', { storeId })
      .getOne();

    if (!productCategory) throw new NotFoundException();
    if (productCategory.totalProducts) throw new BadRequestException(EXCEPTIONS.CATEGORY_HAS_PRODUCTS);

    return this.productCategoriesService.remove(productCategory);
  }
}
