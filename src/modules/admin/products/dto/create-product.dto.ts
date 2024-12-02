import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EProductStatus } from 'src/common/enums';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: EProductStatus })
  @IsEnum(EProductStatus)
  @IsNotEmpty()
  status: EProductStatus;

  @ApiProperty()
  @IsInt()
  productCategoryId: number;

  @ApiProperty()
  @IsUUID()
  imageId: string;
}
