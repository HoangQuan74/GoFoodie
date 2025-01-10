import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsEnum, IsOptional } from 'class-validator';
import { EStoreAddressType } from 'src/common/enums';

export class UpdateStoreAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  building: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gate: string;

  @ApiProperty()
  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  lat: number;

  @ApiProperty()
  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  lng: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ enum: EStoreAddressType })
  @IsEnum(EStoreAddressType)
  type: EStoreAddressType;
}
