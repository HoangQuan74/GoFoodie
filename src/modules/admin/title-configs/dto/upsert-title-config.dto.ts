import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, ValidateNested } from 'class-validator';
import { ETitleIconPosition, ETitlePolicyFrequency, ETitlePolicyType } from 'src/common/enums';
import { IdDto } from 'src/common/query';

export class DriverTitlePolicyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  condition: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  point: number;

  @ApiProperty({ enum: ETitlePolicyType })
  @IsEnum(ETitlePolicyType)
  type: ETitlePolicyType;

  @ApiProperty({ enum: ETitlePolicyFrequency })
  @IsEnum(ETitlePolicyFrequency)
  frequency: ETitlePolicyFrequency;
}

export class DriverTitleDto {
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

  @ApiProperty({ enum: ETitleIconPosition })
  @IsEnum(ETitleIconPosition)
  iconPosition: ETitleIconPosition;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [DriverTitlePolicyDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => DriverTitlePolicyDto)
  @IsNotEmpty()
  policies: DriverTitlePolicyDto[];
}

export class UpsertDriverTitleConfigDto {
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

  @ApiProperty({ type: [DriverTitleDto] })
  @IsArray()
  @ValidateNested()
  @Type(() => DriverTitleDto)
  driverTitles: DriverTitleDto[];
}
