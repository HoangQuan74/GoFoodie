import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EProductCategoryStatus } from 'src/common/enums';

export class CreateProductCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  storeId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ type: 'enum', enum: EProductCategoryStatus })
  @IsEnum(EProductCategoryStatus)
  @IsOptional()
  status: EProductCategoryStatus;
}
