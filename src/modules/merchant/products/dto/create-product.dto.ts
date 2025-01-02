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
  @ApiProperty({ description: 'Id nhóm tùy chọn (Topping)' })
  @IsInt()
  optionGroupId: number;

  @ApiProperty({ type: [CreateOptionDto], description: 'Danh sách tùy chọn' })
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
  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả sản phẩm' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'Giá sản phẩm' })
  @IsNumber()
  price: number;

  @ApiProperty({ enum: EProductStatus, description: 'Trạng thái sản phẩm' })
  @IsEnum(EProductStatus)
  @IsNotEmpty()
  status: EProductStatus;

  @ApiProperty({ description: 'Id danh mục sản phẩm' })
  @IsInt()
  productCategoryId: number;

  @ApiProperty({ description: 'Id hình ảnh sản phẩm' })
  @IsUUID()
  imageId: string;

  @ApiProperty({ description: 'Có phải bán theo thời gian bình thường không' })
  @IsBoolean()
  @Type(() => Boolean)
  isNormalTime: boolean;

  @ApiPropertyOptional({ type: [CreateProductWorkingTimeDto], description: 'Danh sách thời gian bán' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateProductWorkingTimeDto)
  productWorkingTimes: CreateProductWorkingTimeDto[];

  @ApiPropertyOptional({ type: [Number], description: 'Danh sách nhóm tùy chọn (Topping)' })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  optionIds: number[];
}
