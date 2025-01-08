import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getProduct(@Param('id') id: number) {
    const queryBuilder = this.productsService
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.price', 'product.description', 'product.imageId'])
      .leftJoinAndSelect('product.productOptionGroups', 'optionGroups')
      .leftJoinAndSelect('optionGroups.options', 'options')
      .where('product.id = :id', { id });
    const product = await queryBuilder.getOne();
    if (!product) throw new NotFoundException();

    return product;
  }
}
