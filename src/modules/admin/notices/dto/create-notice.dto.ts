import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { EAppType } from 'src/common/enums/config.enum';
import { ENoticeSendType } from 'src/common/enums/notice.enum';
import { CreateCriteriaDto } from '../../banners/dto/create-banner.dto';

export class CreateNoticeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content: string;

  @ApiProperty()
  @IsInt()
  noticeTypeId: number;

  @ApiProperty({ enum: ENoticeSendType })
  @IsEnum(ENoticeSendType)
  sendType: ENoticeSendType;

  @ApiProperty({ enum: EAppType })
  @IsEnum(EAppType)
  appType: EAppType;

  @ApiProperty()
  @IsBoolean()
  sendNow: boolean;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startTime: Date;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ type: [CreateCriteriaDto] })
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @Type(() => CreateCriteriaDto)
  criteria: CreateCriteriaDto[];
}
