import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { EBannerDisplayType, EBannerLinkType, ECriteriaType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';

export class CreateBannerImageDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  fileId: string;

  @ApiProperty()
  @IsNumber()
  sort: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  link: string;

  @ApiProperty({ enum: EBannerLinkType })
  @IsEnum(EBannerLinkType)
  linkType: EBannerLinkType;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  videoThumbnailId: string;
}

export class CreateCriteriaDto {
  @ApiProperty({ enum: ECriteriaType })
  @IsEnum(ECriteriaType)
  type: ECriteriaType;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  value: number[];
}

export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ enum: EAppType })
  @IsEnum(EAppType)
  appType: EAppType;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ enum: EBannerDisplayType })
  @IsEnum(EBannerDisplayType)
  displayType: EBannerDisplayType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  startDate: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  endDate: Date;

  @ApiProperty({ type: [CreateBannerImageDto] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateBannerImageDto)
  files: CreateBannerImageDto[];

  @ApiProperty({ type: [CreateCriteriaDto] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateCriteriaDto)
  criteria: CreateCriteriaDto[];
}
