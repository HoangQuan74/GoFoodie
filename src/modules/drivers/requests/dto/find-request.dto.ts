import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ERequestStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class FindRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERequestStatus })
  @IsEnum(ERequestStatus)
  @ValidateIf((o) => o.status)
  @IsOptional()
  status: ERequestStatus;
}
