import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EStaffRole, EStaffStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryStaffDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EStaffStatus })
  @IsEnum(EStaffStatus)
  @IsOptional()
  status: EStaffStatus;

  @ApiPropertyOptional({ enum: EStaffRole })
  @IsEnum(EStaffRole)
  @IsOptional()
  roleCode: EStaffRole;
}
