import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, ValidateIf } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EMerchantStatus } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';

export class CreateMerchantDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsEmail({}, { message: EXCEPTIONS.INVALID_EMAIL })
  @ValidateIf((o) => !o.phone || o.email)
  email: string;

  @ApiPropertyOptional()
  @IsStrongPassword()
  @ValidateIf((o) => !o.phone)
  password: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  @ValidateIf((o) => !o.email || o.phone)
  phone: string;

  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsEnum(EMerchantStatus)
  @IsOptional()
  status: EMerchantStatus;
}
