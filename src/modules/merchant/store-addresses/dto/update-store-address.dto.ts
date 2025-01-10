import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsLatitude, IsLongitude, IsEnum, IsOptional } from 'class-validator';
import { EStoreAddressType } from 'src/common/enums';

export class UpdateStoreAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
  lat: number;

  @ApiProperty()
  @IsLongitude()
  lng: number;

  @ApiProperty({ enum: EStoreAddressType })
  @IsEnum(EStoreAddressType)
  type: EStoreAddressType;
}
