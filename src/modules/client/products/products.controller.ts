import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EOptionGroupStatus, EOptionStatus } from 'src/common/enums';
import { VouchersService } from '../vouchers/vouchers.service';
import { Brackets } from 'typeorm';
import { EVoucherType } from 'src/common/enums/voucher.enum';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly vouchersService: VouchersService,
  ) {}

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    const queryBuilder = this.productsService
      .createQueryBuilderView('product')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.description',
        'product.imageId',
        'product.sold',
        'product.liked',
      ])
      .addSelect(['productOptionGroups.id'])
      .addSelect(['optionGroup.id', 'optionGroup.name', 'optionGroup.isMultiple', 'optionGroup.status'])
      .addSelect(['options.id', 'options.name', 'options.price'])
      .leftJoin('product.productOptionGroups', 'productOptionGroups')
      .leftJoin('productOptionGroups.optionGroup', 'optionGroup')
      .leftJoin('productOptionGroups.options', 'options', 'options.status = :status')
      .setParameter('status', EOptionStatus.Active)
      .orderBy('optionGroup.isMultiple', 'ASC')
      .where('product.id = :id', { id });

    const product = await queryBuilder.getOne();
    if (!product) throw new NotFoundException();

    product.liked = Number(product.liked);
    product.sold = Number(product.sold);
    product.productOptionGroups = product.productOptionGroups.filter(
      (item) => item.options.length && item.optionGroup.status === EOptionGroupStatus.Active,
    );
    return product;
  }

  @Get(':productId/vouchers')
  @ApiOperation({ summary: 'Get vouchers of product' })
  async getVouchers(@Param('productId') productId: number) {
    const product = await this.productsService.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException();

    const now = new Date();
    return this.vouchersService
      .createQueryBuilder('voucher')
      .leftJoin('voucher.stores', 'store')
      .leftJoin('voucher.products', 'product')
      .where('voucher.startTime <= :now')
      .andWhere('voucher.endTime >= :now')
      .andWhere('voucher.isActive = true')
      .andWhere('voucher.isPrivate = false')
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere(`voucher.typeId = ${EVoucherType.AllStore}`);
          qb.orWhere(
            new Brackets((qb) => {
              qb.where(`voucher.typeId = ${EVoucherType.Store}`);
              qb.andWhere(
                new Brackets((qb) => {
                  qb.where('voucher.isAllItems = true');
                  qb.orWhere('store.id = :storeId', { storeId: product.storeId });
                }),
              );
            }),
          );
          qb.orWhere(
            new Brackets((qb) => {
              qb.where(`voucher.typeId = ${EVoucherType.Product}`);
              qb.andWhere('product.id = :productId', { productId });
            }),
          );
        }),
      )
      .setParameter('now', now)
      .getMany();
  }
}
