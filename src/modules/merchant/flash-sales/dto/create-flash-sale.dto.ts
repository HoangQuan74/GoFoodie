import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AddFlashSaleProductDto } from './add-flash-sale-products.dto';
import { Type } from 'class-transformer';

export class CreateFlashSaleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsInt()
  timeFrameId: number;

  @ApiProperty({ type: [AddFlashSaleProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddFlashSaleProductDto)
  products: AddFlashSaleProductDto[];
}
