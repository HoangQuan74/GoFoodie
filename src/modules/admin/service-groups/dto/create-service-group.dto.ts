import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
