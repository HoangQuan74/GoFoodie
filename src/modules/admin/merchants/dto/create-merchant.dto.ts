import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EMerchantStatus } from 'src/common/enums';

export class CreateMerchantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsEmail()
  @ValidateIf((o) => !o.phone || o.email)
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.phone)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  phone: string;

  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsEnum(EMerchantStatus)
  @IsOptional()
  status: EMerchantStatus;
}
