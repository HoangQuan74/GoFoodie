import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  @Type(() => Number)
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

  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;
}
