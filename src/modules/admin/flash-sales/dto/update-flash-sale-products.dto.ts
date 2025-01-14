import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddFlashSaleProductDto, AddFlashSaleProductsDto } from './add-flash-sale-products.dto';
import { UpdateFlashSaleDto } from './update-flash-sale.dto';
import { IsInt } from 'class-validator';

export class UpdateFlashSaleProductDto extends PartialType(AddFlashSaleProductDto) {
  @ApiProperty()
  @IsInt()
  id: number;
}

// export class UpdateFlashSaleProductsDto {
//   @ApiProperty({ type: [UpdateFlashSaleProductDto] })
//   @Type(() => UpdateFlashSaleProductDto)
//   @
//   products: UpdateFlashSaleProductDto[];
// }
