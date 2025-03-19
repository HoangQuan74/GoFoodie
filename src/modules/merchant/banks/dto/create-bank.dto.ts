import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty()
  @IsInt()
  bankId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
