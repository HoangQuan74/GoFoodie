import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EOptionGroupStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryOptionGroupDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsEnum(EOptionGroupStatus)
  @IsOptional()
  @ValidateIf((o) => o.status)
  status: EOptionGroupStatus;
}
