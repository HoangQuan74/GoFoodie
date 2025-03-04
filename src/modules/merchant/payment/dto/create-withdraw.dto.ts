import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUrl, Min } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty()
  @IsInt()
  @Min(10000)
  amount: number;

  @ApiProperty()
  @IsUrl()
  returnUrl: string = 'https://sand-cms.9pay.vn/simulator/payment/result';
}
