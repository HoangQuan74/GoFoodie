import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { EAppType } from 'src/common/enums/config.enum';

export class CreateAppTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: EAppType;
}

export class CreateCancelOrderReasonDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({ type: [CreateAppTypeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateAppTypeDto)
  appTypes: CreateAppTypeDto[];
}

export class CreateCancelOrderReasonsDto {
  @ApiProperty({ type: [CreateCancelOrderReasonDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => CreateCancelOrderReasonDto)
  reasons: CreateCancelOrderReasonDto[];
}
