import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ESortStore, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryStoreDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  merchantId: number;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  businessAreaId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  serviceTypeId: number;

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

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  createdAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  approvedAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  approvedAtTo: Date;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isDraft: boolean;
}
