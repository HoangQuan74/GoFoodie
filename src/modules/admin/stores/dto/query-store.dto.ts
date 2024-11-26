import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ESortStore, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryStoreDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  search: string;

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

  @ApiPropertyOptional({ enum: ESortStore })
  @IsOptional()
  @IsEnum(ESortStore)
  @ValidateIf((o) => o.sort)
  sort: ESortStore = ESortStore.CreatedAtDesc;
}
