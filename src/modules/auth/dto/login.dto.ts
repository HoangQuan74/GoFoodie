import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    name: 'username',
    description: 'Username of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'Password of the user',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
