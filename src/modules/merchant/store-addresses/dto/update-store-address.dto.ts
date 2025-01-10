import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  lat: number;

  @ApiProperty()
  @IsLongitude()
  @IsOptional()
  lng: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ enum: EStoreAddressType })
  @IsEnum(EStoreAddressType)
  type: EStoreAddressType;
}
