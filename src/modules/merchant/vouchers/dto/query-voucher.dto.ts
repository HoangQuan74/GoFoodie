import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { PaginationQuery } from 'src/common/query';
import { EVoucherStatus } from 'src/common/enums/voucher.enum';

export class QueryVoucherDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  startTimeFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startTimeTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endTimeFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endTimeTo: Date;

  @ApiPropertyOptional({ enum: EVoucherStatus })
  @IsEnum(EVoucherStatus)
  @ValidateIf((o) => o.status)
  status: EVoucherStatus;
}
