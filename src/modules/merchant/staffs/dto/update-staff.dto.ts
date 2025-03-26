import { ApiPropertyOptional } from '@nestjs/swagger';
import { EStaffRole } from 'src/common/enums';
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

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  operationCodes: string[];
}
