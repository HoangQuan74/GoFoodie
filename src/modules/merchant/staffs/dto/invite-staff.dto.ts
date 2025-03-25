import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';
import { EStaffRole } from 'src/common/enums';

export class InviteStaffDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ enum: EStaffRole })
  @IsEnum(EStaffRole)
  roleCode: EStaffRole;

  @ApiPropertyOptional()
  @IsEmail()
  @ValidateIf((o) => !o.phone)
  email: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @ValidateIf((o) => !o.email)
  phone: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  operationCodes: string[];
}
