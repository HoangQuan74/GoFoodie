import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsUrl, Min } from 'class-validator';
import { EPaymentMethod } from 'src/common/enums';

export class CreateDepositDto {
  @ApiProperty()
  @IsInt()
  @Min(10000)
  amount: number;

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  method: EPaymentMethod;

  @ApiProperty()
  @IsUrl()
  returnUrl: string = 'https://sand-cms.9pay.vn/simulator/payment/result';
}
