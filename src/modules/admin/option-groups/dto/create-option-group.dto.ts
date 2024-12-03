import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  ValidateNested,
} from 'class-validator';
import { EOptionGroupStatus, EOptionStatus } from 'src/common/enums';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ enum: EOptionStatus })
  @IsEnum(EOptionStatus)
  status: EOptionStatus;
}

export class CreateOptionGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  storeId: number;

  @ApiProperty()
  @IsBoolean()
  isMultiple: boolean;

  @ApiProperty({ enum: EOptionGroupStatus })
  @IsEnum(EOptionGroupStatus)
  status: EOptionGroupStatus;

  @ApiProperty({ type: [CreateOptionDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
