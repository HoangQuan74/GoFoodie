import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TimeRangeV2 } from 'src/common/enums';

export class QueryRevenueChartDto {
  @ApiProperty({ type: TimeRangeV2, enum: TimeRangeV2 })
  @IsEnum(TimeRangeV2)
  type: TimeRangeV2;
}
