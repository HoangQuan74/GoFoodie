import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryStoreDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EStoreApprovalStatus })
  @IsOptional()
  @IsEnum(EStoreApprovalStatus)
  @ValidateIf((o) => o.approvalStatus)
  approvalStatus: EStoreApprovalStatus;

  @ApiPropertyOptional({ enum: EStoreStatus })
  @IsOptional()
  @IsEnum(EStoreStatus)
  @ValidateIf((o) => o.status)
  status: EStoreStatus;
}
