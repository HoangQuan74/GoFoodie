import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { EOrderCriteriaType } from 'src/common/enums/order-criteria.enum';

export class CreateOrderCriteriaItemsDto {
  @ApiProperty({ enum: EOrderCriteriaType })
  @IsEnum(EOrderCriteriaType)
  type: EOrderCriteriaType;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  value: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  priority: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  serviceTypeId: number;
}

export class CreateOrderCriteriaDto {
  @ApiProperty({ type: [CreateOrderCriteriaItemsDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateOrderCriteriaItemsDto)
  items: CreateOrderCriteriaItemsDto[];
}
