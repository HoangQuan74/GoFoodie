import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EOptionGroupStatus, EOptionStatus } from 'src/common/enums';
import { IdDto } from 'src/common/query';

export class CreateOptionDto {
  @ApiProperty({ description: 'Tên tùy chọn' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Giá tùy chọn' })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ enum: EOptionStatus, description: 'Trạng thái tùy chọn' })
  @IsEnum(EOptionStatus)
  status: EOptionStatus;
}

export class CreateOptionGroupDto {
  @ApiProperty({ description: 'Tên nhóm tùy chọn (Topping)' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Có phải là nhóm tùy chọn được chọn nhiều lựa chọn không' })
  @IsBoolean()
  isMultiple: boolean;

  @ApiProperty({ enum: EOptionGroupStatus, description: 'Trạng thái nhóm tùy chọn' })
  @IsEnum(EOptionGroupStatus)
  status: EOptionGroupStatus;

  @ApiProperty({ type: [CreateOptionDto], description: 'Danh sách tùy chọn' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @ApiPropertyOptional({ type: [IdDto], description: 'Danh sách sản phẩm liên kết' })
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  @IsArray()
  @IsOptional()
  products: IdDto[];
}
