import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateCriteriaDto } from '../../banners/dto/create-banner.dto';

export class CreateChallengeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsInt()
  duration: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty()
  @IsBoolean()
  isLimitedBudget: boolean;

  @ApiProperty()
  @IsInt()
  budget: number;

  @ApiProperty()
  @IsNumber()
  reward: number;

  @ApiProperty()
  @IsString()
  positionValue: string;

  @ApiProperty()
  @IsInt()
  typeId: number;

  @ApiProperty()
  @IsInt()
  serviceTypeId: number;

  @ApiProperty({ type: [CreateCriteriaDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => CreateCriteriaDto)
  criteria: CreateCriteriaDto[];

  @ApiProperty()
  @IsUUID()
  imageId: string;
}
