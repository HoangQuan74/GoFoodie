import { PaginationQuery } from './../../../../common/query/base.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EProductApprovalStatus, EProductStatus } from 'src/common/enums';

export class QueryProductDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EProductStatus })
  @IsEnum(EProductStatus)
  @ValidateIf((o) => o.status)
  status: EProductStatus;

  @ApiPropertyOptional({ enum: EProductApprovalStatus })
  @IsEnum(EProductApprovalStatus)
  @ValidateIf((o) => o.approvalStatus)
  approvalStatus: EProductApprovalStatus;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isDisplay: boolean;
}
