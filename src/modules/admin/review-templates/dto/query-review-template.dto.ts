import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { ERoleType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryReviewTemplateDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERoleType })
  @IsOptional()
  @IsEnum(ERoleType)
  type?: ERoleType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isFiveStar?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isActive?: boolean;
}
