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
  UseGuards,
} from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { StoresService } from '../stores/stores.service';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { Brackets, DataSource, IsNull, Not } from 'typeorm';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { ProductEntity } from 'src/database/entities/product.entity';
import { EXCEPTIONS } from 'src/common/constants';
import { EProductCategoryStatus, EProductStatus } from 'src/common/enums';
import { AuthGuard } from '../auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { OPERATIONS } from 'src/common/constants/operation.constant';

@Controller('product-categories')
@ApiTags('Quản lý danh mục sản phẩm')
@UseGuards(AuthGuard, AdminRolesGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  @Roles(OPERATIONS.PRODUCT_CATEGORY.CREATE)
  async create(@Body() body: CreateProductCategoryDto) {
    const { storeId, parentId, ...rest } = body;
    const { name, serviceGroupId } = rest;

    if (!storeId) {
      const exist = await this.productCategoriesService.findOne({ where: { name, serviceGroupId } });
      if (exist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);

      const productCategory = await this.productCategoriesService.save(rest);
      const productCategoryCode = `${productCategory.id.toString().padStart(4, '0')}`;
      productCategory.code = productCategoryCode;
      return this.productCategoriesService.save(productCategory);
    } else {
      const store = await this.storesService.findOne({ where: { id: storeId } });
      if (!store) throw new NotFoundException();

      const parentCategory = await this.productCategoriesService.findOne({ where: { id: parentId } });
      if (!parentCategory) throw new NotFoundException();
      if (parentCategory.serviceGroupId !== store.serviceGroupId) throw new BadRequestException();

      if (!body.name || body.name === parentCategory.name) {
        await this.productCategoriesService.createProductCategoryIfNotExist(parentId, storeId);
      } else {
        const exist = await this.productCategoriesService.findOne({ where: { name: body.name, storeId } });
        if (exist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);

        body.serviceGroupId = store.serviceGroupId;
        body.storeId = storeId;
        body.parentId = parentId;

        const productCategory = await this.productCategoriesService.save(body);
        const productCategoryCode = `${productCategory.id.toString().padStart(4, '0')}`;
        productCategory.code = productCategoryCode;
        return this.productCategoriesService.save(productCategory);
      }
    }
  }

  @Get('list')
  async list(@Query() query: QueryProductCategoryDto) {
    const { storeId, status, search, serviceGroupId } = query;
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
    serviceGroupId && queryBuilder.andWhere('category.serviceGroupId = :serviceGroupId', { serviceGroupId });

    return queryBuilder.getMany();
  }

  @Get()
  async find(@Query() query: QueryProductCategoryDto) {
    const { page, limit, search, storeId, status, serviceGroupId } = query;

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
        'category.serviceGroupId as "serviceGroupId"',
        'serviceGroup.name as "serviceGroupName"',
        'category.parentId as "parentId"',
        'parent.name as "parentName"',
      ])
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(product.id)', 'totalProducts')
          .from('products', 'product')
          .where('product.productCategoryId = category.id');
      }, 'totalProducts')
      .leftJoin('category.serviceGroup', 'serviceGroup')
      .leftJoin('category.parent', 'parent');

    if (storeId) {
      queryBuilder.leftJoin('category.stores', 'store', 'store.id = :storeId');
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('category.storeId = :storeId', { storeId });
          qb.orWhere('store.id IS NOT NULL');
        }),
      );
      queryBuilder.groupBy('category.id');
      queryBuilder.addGroupBy('serviceGroup.id');
      queryBuilder.addGroupBy('parent.id');
      queryBuilder.setParameter('storeId', storeId);
    } else {
      queryBuilder.andWhere('category.storeId IS NULL');
    }

    status && queryBuilder.andWhere('category.status = :status', { status });
    serviceGroupId && queryBuilder.andWhere('category.serviceGroupId = :serviceGroupId', { serviceGroupId });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('category.name ILIKE :search', { search: `%${search}%` });
          qb.orWhere('category.code ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const items = await queryBuilder
      .orderBy('category.id', 'DESC')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();

    const total = await queryBuilder.getCount();
    return { items, total };
  }

  @Patch(':id')
  @Roles(OPERATIONS.PRODUCT_CATEGORY.UPDATE)
  async update(@Param('id') id: string, @Body() updateProductCategoryDto: UpdateProductCategoryDto) {
    const { name } = updateProductCategoryDto;
    const productCategory = await this.productCategoriesService.findOne({ where: { id: +id } });
    if (!productCategory) throw new NotFoundException();

    const { storeId, serviceGroupId } = productCategory;
    if (storeId) {
      const exist = await this.productCategoriesService.exists([
        { name, storeId, id: Not(+id) },
        { name, id: Not(+id), storeId: IsNull() },
      ]);
      if (exist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);
    } else {
      const exist = await this.productCategoriesService.exists({ name, serviceGroupId, id: Not(+id) });
      if (exist) throw new ConflictException(EXCEPTIONS.NAME_EXISTED);
    }

    return this.productCategoriesService.save({ ...productCategory, ...updateProductCategoryDto });
  }

  @Delete(':id')
  @Roles(OPERATIONS.PRODUCT_CATEGORY.DELETE)
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
