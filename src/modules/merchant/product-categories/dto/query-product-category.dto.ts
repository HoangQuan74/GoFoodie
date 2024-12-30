import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EProductApprovalStatus, EProductCategoryStatus, EProductStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryProductCategoryDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EProductCategoryStatus })
  @IsEnum(EProductCategoryStatus)
  @ValidateIf((o) => o.status)
  status: EProductCategoryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  includeProducts: boolean;

  @ApiPropertyOptional({ enum: EProductStatus })
  @IsEnum(EProductStatus)
  @IsOptional()
  productStatus: EProductStatus;

  @ApiPropertyOptional({ enum: EProductApprovalStatus })
  @IsEnum(EProductApprovalStatus)
  @IsOptional()
  approvalStatus: EProductApprovalStatus;
}
