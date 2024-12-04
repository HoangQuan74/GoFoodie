import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOptionGroupDto } from './create-option-group.dto';
import { IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductOptionGroupDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class UpdateOptionGroupDto extends PartialType(CreateOptionGroupDto) {
  @ApiPropertyOptional({ type: [UpdateProductOptionGroupDto] })
  @ValidateNested({ each: true })
  @Type(() => UpdateProductOptionGroupDto)
  @IsArray()
  @IsOptional()
  products: UpdateProductOptionGroupDto[];
}
