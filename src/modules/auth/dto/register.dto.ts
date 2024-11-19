import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user',
    type: String,
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    name: 'password',
    description:
      'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    type: String,
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
