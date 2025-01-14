import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';
import { EOptionGroupStatus, EOptionStatus } from 'src/common/enums';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    const queryBuilder = this.productsService
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.price', 'product.description', 'product.imageId'])
      .addSelect(['productOptionGroups.id'])
      .addSelect(['optionGroup.id', 'optionGroup.name', 'optionGroup.isMultiple', 'optionGroup.status'])
      .addSelect(['options.id', 'options.name', 'options.price'])
      .leftJoin('product.productOptionGroups', 'productOptionGroups')
      .leftJoin('productOptionGroups.optionGroup', 'optionGroup')
      .leftJoin('productOptionGroups.options', 'options', 'options.status = :status')
      .setParameter('status', EOptionStatus.Active)
      .where('product.id = :id', { id });

    const product = await queryBuilder.getOne();
    if (!product) throw new NotFoundException();

    product.productOptionGroups = product.productOptionGroups.filter(
      (item) => item.options.length && item.optionGroup.status === EOptionGroupStatus.Active,
    );
    return product;
  }
}
