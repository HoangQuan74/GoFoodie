import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsNumberString, IsOptional, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';
import { EPaymentMethod } from 'src/common/enums';

export class CreateCoinDto {
  @ApiProperty()
  @IsNumber()
  @Min(10000)
  @Max(10000000)
  amount: number;

  @ApiProperty({ enum: EPaymentMethod })
  @IsEnum(EPaymentMethod)
  method: EPaymentMethod;

  @ApiPropertyOptional()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  @IsOptional()
  pin: string;

  @ApiProperty()
  @IsUrl()
  returnUrl: string = 'https://sand-cms.9pay.vn/simulator/payment/result';
}
