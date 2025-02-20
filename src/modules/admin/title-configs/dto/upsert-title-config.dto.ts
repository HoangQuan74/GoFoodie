import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ETitleIconPosition, ETitlePolicyFrequency, ETitlePolicyType } from 'src/common/enums';
import { IdDto } from 'src/common/query';

export class TitlePolicyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  point: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  criteriaId: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  sanctionId: number;

  @ApiProperty({ enum: ETitlePolicyType })
  @IsEnum(ETitlePolicyType)
  type: ETitlePolicyType;

  @ApiProperty({ enum: ETitlePolicyFrequency })
  @IsEnum(ETitlePolicyFrequency)
  frequency: ETitlePolicyFrequency;
}

export class TitleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  level: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  point: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  iconId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty({ enum: ETitleIconPosition })
  @IsEnum(ETitleIconPosition)
  iconPosition: ETitleIconPosition;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [TitlePolicyDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => TitlePolicyDto)
  @IsNotEmpty()
  policies: TitlePolicyDto[];
}

export class UpsertTitleConfigDto {
  @ApiProperty({ type: [IdDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => IdDto)
  @IsNotEmpty()
  serviceTypes: IdDto[];

  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ type: Date })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ type: [TitleDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => TitleDto)
  titles: TitleDto[];
}
