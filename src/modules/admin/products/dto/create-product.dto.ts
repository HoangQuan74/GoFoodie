import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EProductStatus } from 'src/common/enums';
import { Type } from 'class-transformer';

export class CreateOptionDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class CreateOptionGroupsDto {
  @ApiProperty()
  @IsInt()
  optionGroupId: number;

  @ApiProperty({ type: [CreateOptionDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateProductWorkingTimeDto {
  @ApiProperty({ description: 'Thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)' })
  @IsInt()
  dayOfWeek: number;

  @ApiProperty({ description: 'Giờ mở cửa (phút)' })
  @IsInt()
  openTime: number;

  @ApiProperty({ description: 'Giờ đóng cửa (phút)' })
  @IsInt()
  closeTime: number;
}

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

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isNormalTime: boolean;

  @ApiPropertyOptional({ type: [CreateProductWorkingTimeDto] })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateProductWorkingTimeDto)
  productWorkingTimes: CreateProductWorkingTimeDto[];

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  optionIds: number[];
}
