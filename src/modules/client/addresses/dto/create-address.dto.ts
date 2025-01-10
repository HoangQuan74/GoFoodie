import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { EClientAddressType } from 'src/common/enums';

export class CreateAddressDto {
  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  building: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gate: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty({ enum: EClientAddressType })
  @IsEnum(EClientAddressType)
  type: EClientAddressType;
}
