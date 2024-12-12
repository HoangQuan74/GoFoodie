import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { EAdminStatus } from 'src/common/enums';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({ enum: EAdminStatus })
  @IsEnum(EAdminStatus)
  status: EAdminStatus;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @IsOptional()
  @ValidateIf((o) => o.phone)
  phone: string;
}
