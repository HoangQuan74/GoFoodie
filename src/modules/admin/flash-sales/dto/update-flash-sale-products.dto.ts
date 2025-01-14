import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddFlashSaleProductDto } from './add-flash-sale-products.dto';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFlashSaleProductDto extends PartialType(AddFlashSaleProductDto) {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class UpdateFlashSaleProductsDto {
  @ApiProperty({ type: [UpdateFlashSaleProductDto] })
  @Type(() => UpdateFlashSaleProductDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  products: UpdateFlashSaleProductDto[];
}
