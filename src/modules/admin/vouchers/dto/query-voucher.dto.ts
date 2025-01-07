import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/common/query';

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

  @ApiPropertyOptional()
  @IsOptional()
  typeId: number;
}
