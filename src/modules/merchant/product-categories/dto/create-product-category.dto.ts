import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.parentId)
  name: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  parentId: number;
}
