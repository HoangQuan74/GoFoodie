import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { EProductCategoryStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryProductCategoryDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  storeId: number;

  @ApiPropertyOptional({ type: 'enum', enum: EProductCategoryStatus })
  @IsEnum(EProductCategoryStatus)
  @IsOptional()
  @ValidateIf((o) => o.status)
  status: EProductCategoryStatus;
}
