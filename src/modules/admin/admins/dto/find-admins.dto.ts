import { PaginationQuery } from 'src/common/query';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EAdminStatus } from 'src/common/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAdminsDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EAdminStatus })
  @IsOptional()
  @IsEnum(EAdminStatus)
  @ValidateIf((o) => o.status)
  status: EAdminStatus;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}
