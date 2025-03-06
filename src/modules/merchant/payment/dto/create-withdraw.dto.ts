import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { EAccountType } from 'src/common/enums';

export class CreateWithdrawDto {
  @ApiProperty()
  @IsInt()
  @Min(10000)
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty({ enum: EAccountType, description: '0: Số tài khoản ngân hàng, 1: Số thẻ ngân hàng' })
  @IsEnum(EAccountType)
  accountType: EAccountType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNo: string;
}
