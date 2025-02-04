import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ERoleType } from 'src/common/enums';

export class CreateReviewTemplateItemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}

export class CreateReviewTemplateDto {
  @ApiProperty({ enum: ERoleType })
  @IsEnum(ERoleType)
  type: ERoleType;

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
