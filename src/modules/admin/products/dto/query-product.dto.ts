import { PaginationQuery } from './../../../../common/query/base.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
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
}
