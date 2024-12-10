import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

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
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deviceToken: string;
}
