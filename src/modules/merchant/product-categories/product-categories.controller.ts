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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryProductCategoryDto } from './dto/query-product-category.dto';
import { Brackets, IsNull, Not } from 'typeorm';
import { StoresService } from '../stores/stores.service';
import { EProductApprovalStatus, EProductCategoryStatus, EProductStatus } from 'src/common/enums';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { EXCEPTIONS } from 'src/common/constants';
import { ProductsService } from '../products/products.service';
import { StoreEntity } from 'src/database/entities/store.entity';

@Controller('product-categories')
@ApiTags('Product Categories')
@UseGuards(AuthGuard)
export class ProductCategoriesController {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
    private readonly storesService: StoresService,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục sản phẩm' })
  async create(@CurrentStore() storeId: number, @Body() body: CreateProductCategoryDto) {
    const store = await this.storesService.findOne({
      select: { id: true, serviceGroupId: true },
      where: { id: storeId },
    });
    if (!store) throw new NotFoundException();

    const { parentId, name } = body;

    const parent = await this.productCategoriesService.findOne({ where: { id: parentId } });
    if (!parent) throw new NotFoundException();

    if (!name || name === parent.name) {
      const isExist = await this.productCategoriesService.findOne({ where: { id: parentId, stores: { id: storeId } } });
      if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

      await this.productCategoriesService
        .createQueryBuilder('productCategory')
        .relation('stores')
        .of(parent)
        .add(storeId);

      return parent;
    } else {
      const isExist = await this.productCategoriesService.findOne({ where: { name, storeId } });
      if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

      return this.productCategoriesService.save({ name, storeId, serviceGroupId: store.serviceGroupId, parentId });
    }
  }

  @Get('global')
  @ApiOperation({ summary: 'Danh sách danh mục sản phẩm của hệ thống' })
  async getGlobalCategories(@CurrentStore() storeId: number) {
    const queryBuilder = this.productCategoriesService
      .createQueryBuilder('productCategory')
      .select(['productCategory.id', 'productCategory.name'])
      .where('productCategory.storeId IS NULL')
      .innerJoin(StoreEntity, 'store', 'store.serviceGroupId = productCategory.serviceGroupId AND store.id = :storeId')
      .setParameters({ storeId })
      .andWhere('productCategory.status = :status', { status: EProductCategoryStatus.Active });

    const [items, total] = await queryBuilder.getManyAndCount();

    return { items, total };
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách danh mục sản phẩm của cửa hàng' })
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
        const subQuery = qb.andWhere('products.storeId = :storeId', { storeId });
        productStatus && subQuery.andWhere('products.status = :productStatus', { productStatus });
        approvalStatus && subQuery.andWhere('products.approvalStatus = :approvalStatus', { approvalStatus });

        return subQuery;
      })
      .where(
        new Brackets((qb) => {
          qb.where('productCategory.storeId = :storeId', { storeId });
          qb.orWhere('stores.id = :storeId', { storeId });
        }),
      )
      .andWhere('productCategory.serviceGroupId = :serviceGroupId', { serviceGroupId: store.serviceGroupId })
      .leftJoin('productCategory.stores', 'stores')

      .setParameters({ storeId, productStatus, approvalStatus })
      .orderBy('productCategory.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    search && queryBuilder.andWhere('productCategory.name ILIKE :search', { search: `%${search}%` });
    status && queryBuilder.andWhere('productCategory.status = :status', { status });

    if (includeProducts) {
      queryBuilder.addSelect(['products.id', 'products.name', 'products.status']);
      queryBuilder.leftJoin(
        'productCategory.products',
        'products',
        'products.storeId = :storeId' +
          (productStatus ? ' AND products.status = :productStatus' : '') +
          (approvalStatus ? ' AND products.approvalStatus = :approvalStatus' : ''),
      );
    }

    const where = { storeId };
    productStatus && (where['status'] = productStatus);
    approvalStatus && (where['approvalStatus'] = approvalStatus);
    const totalProducts = await this.productsService.count({ where });

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total, totalProducts };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết danh mục sản phẩm' })
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
  @ApiOperation({ summary: 'Cập nhật danh mục sản phẩm' })
  async update(@CurrentStore() storeId: number, @Param('id') id: number, @Body() body: UpdateProductCategoryDto) {
    const { name } = body;

    const productCategory = await this.productCategoriesService.findOne({ where: { id, storeId } });
    if (!productCategory) throw new NotFoundException();

    const isExist = await this.productCategoriesService
      .createQueryBuilder('productCategory')
      .where('productCategory.name = :name', { name })
      .andWhere('productCategory.id != :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('productCategory.storeId = :storeId', { storeId });
          qb.orWhere('productCategory.storeId IS NULL');
        }),
      )
      .getExists();
    if (isExist) throw new BadRequestException(EXCEPTIONS.NAME_EXISTED);

    Object.assign(productCategory, body);
    return this.productCategoriesService.save(productCategory);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục sản phẩm' })
  async remove(@CurrentStore() storeId: number, @Param('id') id: number) {
    const productCategory = await this.productCategoriesService
      .createQueryBuilder('productCategory')
      .addSelect(['products.id'])
      .loadRelationCountAndMap('productCategory.totalProducts', 'productCategory.products', 'products', (qb) => {
        return qb
          .andWhere(
            new Brackets((qb) => {
              qb.where('products.approvalStatus = :approvalStatus');
              qb.orWhere('products.status = :status');
            }),
          )
          .setParameters({ approvalStatus: EProductApprovalStatus.Rejected, status: EProductStatus.Inactive });
      })
      .leftJoin('productCategory.products', 'products', 'products.storeId = :storeId', { storeId })
      .where('productCategory.id = :id', { id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('productCategory.storeId IS NULL');
          qb.orWhere('stores.id = :storeId', { storeId });
        }),
      )
      .leftJoin('productCategory.stores', 'stores')
      .getOne();

    if (!productCategory) throw new NotFoundException();
    if (productCategory.totalProducts) throw new BadRequestException(EXCEPTIONS.CATEGORY_HAS_PRODUCTS);

    await this.productsService.remove(productCategory.products);

    if (productCategory.storeId) {
      return this.productCategoriesService.remove(productCategory);
    }

    return this.productCategoriesService
      .createQueryBuilder('productCategory')
      .relation('stores')
      .of(productCategory)
      .remove(storeId);
  }

  @Patch(':id/hide-products')
  @ApiOperation({ summary: 'Ẩn tất cả sản phẩm của danh mục' })
  async hideProducts(@CurrentStore() storeId: number, @Param('id') id: number) {
    const productCategory = await this.productCategoriesService.findOne({ where: { id, storeId } });
    if (!productCategory) throw new NotFoundException();

    return this.productsService.update(
      { productCategoryId: id, storeId, approvalStatus: EProductApprovalStatus.Approved },
      { status: EProductStatus.Inactive },
    );
  }

  @Patch(':id/show-products')
  @ApiOperation({ summary: 'Hiện tất cả sản phẩm của danh mục' })
  async showProducts(@CurrentStore() storeId: number, @Param('id') id: number) {
    const productCategory = await this.productCategoriesService.findOne({ where: { id, storeId } });
    if (!productCategory) throw new NotFoundException();

    return this.productsService.update(
      { productCategoryId: id, storeId, approvalStatus: EProductApprovalStatus.Approved },
      { status: EProductStatus.Active },
    );
  }
}
