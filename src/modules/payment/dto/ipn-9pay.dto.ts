import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IPN9PayDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  result: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  checksum: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  version: string;
}
