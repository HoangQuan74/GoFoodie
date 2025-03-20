import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty()
  @IsInt()
  bankId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}
