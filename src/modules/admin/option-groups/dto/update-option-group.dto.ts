import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOptionGroupDto } from './create-option-group.dto';
import { IsInt } from 'class-validator';

export class UpdateProductOptionGroupDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class UpdateOptionGroupDto extends PartialType(CreateOptionGroupDto) {}
