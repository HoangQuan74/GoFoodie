import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';

export class UpdatePhoneDto {
  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(6)
  @IsNotEmpty()
  otp: string;
}
