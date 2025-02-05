import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EUserType } from 'src/common/enums';

export class CreateReviewTemplateItemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  criteriaId: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class CreateReviewTemplateDto {
  @ApiProperty({ enum: EUserType })
  @IsEnum(EUserType)
  type: EUserType;

  @ApiProperty()
  @IsBoolean()
  isFiveStar: boolean;

  @ApiProperty({ type: [CreateReviewTemplateItemDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateReviewTemplateItemDto)
  items: CreateReviewTemplateItemDto[];
}
