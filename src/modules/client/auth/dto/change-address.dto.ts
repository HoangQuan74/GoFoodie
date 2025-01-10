import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class ChangeAddressDto {
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
}
