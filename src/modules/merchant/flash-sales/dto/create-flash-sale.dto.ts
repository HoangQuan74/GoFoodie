import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: [AddFlashSaleProductDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AddFlashSaleProductDto)
  products: AddFlashSaleProductDto[];
}
