import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  ArrayMinSize,
  ValidateNested,
  ValidateIf,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { EDiscountType } from 'src/common/enums/voucher.enum';

export class AddFlashSaleProductDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsInt()
  @ValidateIf((o) => o.discountType === EDiscountType.Percentage)
  discount: number;

  @ApiProperty()
  @IsInt()
  @ValidateIf((o) => o.discountType === EDiscountType.Fixed)
  price: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @IsOptional()
  productQuantity: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @IsOptional()
  limitQuantity: number;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ enum: EDiscountType })
  @IsEnum(EDiscountType)
  @IsNotEmpty()
  discountType: EDiscountType;
}

export class AddFlashSaleProductsDto {
  @ApiProperty({ type: [AddFlashSaleProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddFlashSaleProductDto)
  products: AddFlashSaleProductDto[];
}
