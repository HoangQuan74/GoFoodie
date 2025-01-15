import { PaginationQuery } from './../../../../common/query/base.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  storeId: number;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  serviceGroupIds: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  storeIds: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @Type(() => Number)
  @IsArray()
  @IsInt({ each: true })
  productCategoryIds: number[];
}
