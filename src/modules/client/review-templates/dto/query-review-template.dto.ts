import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EUserType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryReviewTemplateDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EUserType })
  @IsOptional()
  @IsEnum(EUserType)
  type?: EUserType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isFiveStar?: boolean;
}
