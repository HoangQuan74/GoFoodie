import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { EVehicleType } from 'src/common/enums/map.enum';

export class locationDto {
  @ApiProperty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;
}

export class QueryDistanceDto {
  @ApiProperty({ type: locationDto })
  @Type(() => locationDto)
  @ValidateNested()
  @IsObject()
  startingPosition: locationDto;

  @ApiProperty({ type: locationDto })
  @Type(() => locationDto)
  @ValidateNested()
  @IsObject()
  destinationPosition: locationDto;

  @ApiProperty({ type: EVehicleType, enum: EVehicleType })
  @IsEnum(EVehicleType)
  vehicle: EVehicleType;
}
