import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoresService } from '../stores/stores.service';
import { PaginationQuery } from 'src/common/query';
import { DataSource, FindManyOptions, ILike, In } from 'typeorm';
import { ProductEntity } from 'src/database/entities/product.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { OptionEntity } from 'src/database/entities/option.entity';
import { OptionGroupsService } from '../option-groups/option-groups.service';

@Controller('products')
@ApiTags('Quản lý sản phẩm')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly optionGroupsService: OptionGroupsService,
    private readonly dataSource: DataSource,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Param('storeId') storeId: number) {
    return this.dataSource.transaction(async (manager) => {
      const { optionIds = [] } = createProductDto;
      const store = await manager.findOne(StoreEntity, { where: { id: storeId } });
      if (!store) throw new NotFoundException();

      const lastProduct = await manager.findOne(ProductEntity, {
        where: { storeId },
        order: { code: 'DESC' },
        withDeleted: true,
      });
      const numberProduct = lastProduct ? +lastProduct.code.slice(-3) + 1 : 1;
      const productCode = `${store.storeCode}${numberProduct.toString().padStart(3, '0')}`;

      const newProduct = new ProductEntity();
      Object.assign(newProduct, createProductDto);
      newProduct.storeId = storeId;
      newProduct.code = productCode;
      const productOptionGroups = [];

      if (optionIds.length) {
        const options = await manager.find(OptionEntity, { where: { id: In(optionIds) } });
        if (options.length !== optionIds.length) throw new NotFoundException();

        options.forEach((option) => {
          const isExist = productOptionGroups.find((item) => item.optionGroupId === option.optionGroupId);
          if (isExist) {
            isExist.options.push(option);
          } else {
            productOptionGroups.push({ optionGroupId: option.optionGroupId, options: [option] });
          }
        });
      }

      newProduct.productOptionGroups = productOptionGroups;
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
    const product = await this.productsService.findOne({
      select: { productOptionGroups: true, productWorkingTimes: true, productCategory: { id: true, name: true } },
      where: { id: +id },
      relations: {
        productOptionGroups: { options: true, optionGroup: true },
        productWorkingTimes: true,
        productCategory: true,
      },
    });
    if (!product) throw new NotFoundException();

    return product;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const { optionIds = [] } = updateProductDto;
    const product = await this.productsService.findOne({ where: { id: +id } });
    if (!product) throw new NotFoundException();

    const productOptionGroups = [];
    if (optionIds.length) {
      const options = await this.optionGroupsService.findOptions({ where: { id: In(optionIds) } });
      if (options.length !== optionIds.length) throw new NotFoundException();

      options.forEach((option) => {
        const isExist = productOptionGroups.find((item) => item.optionGroupId === option.optionGroupId);
        if (isExist) {
          isExist.options.push(option);
        } else {
          productOptionGroups.push({ optionGroupId: option.optionGroupId, options: [option] });
        }
      });
      product.productOptionGroups = productOptionGroups;
    }

    return this.productsService.save({ ...product, ...updateProductDto });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsService.findOne({ where: { id: +id } });
    if (!product) throw new NotFoundException();

    return this.productsService.remove(product);
  }
}
