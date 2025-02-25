import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TimeRange } from 'src/common/enums';

export class QueryRevenueChartDto {
  @ApiProperty({ type: TimeRange, enum: TimeRange })
  @IsEnum(TimeRange)
  type: TimeRange;
}
