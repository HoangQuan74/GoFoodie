import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EMerchantStatus } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';

export class CreateMerchantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsEmail({}, { message: EXCEPTIONS.INVALID_EMAIL })
  @ValidateIf((o) => !o.phone || o.email)
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.phone)
  password: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  @IsNotEmpty()
  @ValidateIf((o) => !o.email || o.phone)
  phone: string;

  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsEnum(EMerchantStatus)
  @IsOptional()
  status: EMerchantStatus;
}
