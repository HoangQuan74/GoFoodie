import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive, Min } from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants';

export class BaseQueryDto {
  @ApiPropertyOptional({
    name: 'limit',
    description: 'Limit of this query',
    required: false,
    default: DEFAULT_LIMIT,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  limit: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    name: 'page',
    description: 'Page for this query',
    default: DEFAULT_PAGE,
    required: false,
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number = DEFAULT_PAGE;
}
