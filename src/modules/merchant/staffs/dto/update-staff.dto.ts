import { ApiPropertyOptional } from '@nestjs/swagger';
import { EStaffRole, EStaffStatus } from 'src/common/enums';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateStaffDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsEnum(EStaffRole)
  @IsOptional()
  roleCode: EStaffRole;

  @ApiPropertyOptional({ enum: [EStaffStatus.Inactive, EStaffStatus.Active] })
  @IsEnum([EStaffStatus.Inactive, EStaffStatus.Active])
  @IsOptional()
  status: EStaffStatus.Inactive | EStaffStatus.Active;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  operationCodes: string[];
}
