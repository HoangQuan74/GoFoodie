import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ERoleStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class FindRolesDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERoleStatus })
  @IsEnum(ERoleStatus)
  @IsOptional()
  @ValidateIf((o) => o.status)
  status: ERoleStatus;
}
