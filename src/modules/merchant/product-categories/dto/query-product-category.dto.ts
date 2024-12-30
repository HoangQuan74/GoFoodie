import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, ValidateIf } from 'class-validator';
import { EProductCategoryStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryProductCategoryDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EProductCategoryStatus })
  @IsEnum(EProductCategoryStatus)
  @ValidateIf((o) => o.status)
  status: EProductCategoryStatus;

  @ApiPropertyOptional({ type: Boolean })
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  includeProducts: boolean;
}
