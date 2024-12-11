import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordByEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  otp: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}
