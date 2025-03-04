import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EAccountType } from 'src/common/enums';

export class CheckAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNo: string;

  @ApiProperty({ enum: EAccountType, description: '0: Số tài khoản ngân hàng, 1: Số thẻ ngân hàng' })
  @IsEnum(EAccountType)
  @IsNotEmpty()
  accountType: EAccountType;
}
