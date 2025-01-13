import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductCategoryDto } from './create-product-category.dto';

export class UpdateProductCategoryDto extends OmitType(PartialType(CreateProductCategoryDto), [
  'parentId',
  'storeId',
] as const) {}
