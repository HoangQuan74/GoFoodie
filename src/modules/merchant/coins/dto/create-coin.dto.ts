import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateCoinDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(9999999)
  amount: number;
}
