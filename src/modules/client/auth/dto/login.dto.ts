import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}

export class LoginSmsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken: string;

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
  deviceToken: string;
}
