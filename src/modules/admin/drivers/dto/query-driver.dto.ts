import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { EDriverApprovalStatus, EDriverStatus } from 'src/common/enums/driver.enum';
import { PaginationQuery } from 'src/common/query';

export class QueryDriverDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EDriverStatus })
  @IsEnum(EDriverStatus)
  @ValidateIf((o) => o.status)
  status: EDriverStatus;

  @ApiPropertyOptional({ enum: EDriverApprovalStatus })
  @IsEnum(EDriverApprovalStatus)
  @ValidateIf((o) => o.approvalStatus)
  approvalStatus: EDriverApprovalStatus;
}
