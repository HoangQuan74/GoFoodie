import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { EDriverUniformPaymentMethod } from 'src/common/enums/driver.enum';

export class RegisterUniformDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsInt()
  sizeId: number;

  @ApiProperty({ enum: EDriverUniformPaymentMethod })
  @IsEnum(EDriverUniformPaymentMethod)
  paymentMethod: EDriverUniformPaymentMethod;
}
