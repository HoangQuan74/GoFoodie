import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants';

export class PaginationQuery {
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

  @ApiPropertyOptional()
  @IsOptional()
  search: string;
}

export class IdentityQuery {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  ids: number[];
}

export class IdDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class IdUuidDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}
