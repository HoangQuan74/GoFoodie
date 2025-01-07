import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { CreateCriteriaDto } from '../../banners/dto/create-banner.dto';

export class CreateAppFeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  appTypeId: string;

  @ApiProperty()
  @IsNumber()
  value: number;
}

export class CreateFeeDto {
  @ApiProperty()
  @IsNumber()
  feeTypeId: number;

  @ApiProperty()
  @IsNumber()
  serviceTypeId: number;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: [CreateAppFeeDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateAppFeeDto)
  @IsNotEmpty()
  appFees: CreateAppFeeDto[];

  @ApiProperty({ type: [CreateCriteriaDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => CreateCriteriaDto)
  criteria: CreateCriteriaDto[];
}
