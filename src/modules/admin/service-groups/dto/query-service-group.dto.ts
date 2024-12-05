import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EServiceGroupStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryServiceGroupDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EServiceGroupStatus })
  @IsOptional()
  @IsEnum(EServiceGroupStatus)
  @ValidateIf((o) => o.status)
  status: EServiceGroupStatus;
}
