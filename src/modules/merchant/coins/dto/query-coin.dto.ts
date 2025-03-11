import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { EStoreCoinType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';
import * as moment from 'moment';

export class QueryCoinDto extends PaginationQuery {
  @ApiPropertyOptional({ type: EStoreCoinType, enum: EStoreCoinType })
  @IsOptional()
  @IsEnum(EStoreCoinType)
  type: EStoreCoinType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => (value ? moment(value).startOf('day').toDate() : value))
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Transform(({ value }) => (value ? moment(value).endOf('day').toDate() : value))
  endDate?: Date;
}
