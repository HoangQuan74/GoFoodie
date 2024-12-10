import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
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

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  activeAreaId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  serviceTypeId: number;
}
