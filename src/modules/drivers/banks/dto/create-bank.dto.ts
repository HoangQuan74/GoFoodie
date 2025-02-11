import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty()
  @IsInt()
  bankId: number;

  @ApiProperty()
  @IsInt()
  bankBranchId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
