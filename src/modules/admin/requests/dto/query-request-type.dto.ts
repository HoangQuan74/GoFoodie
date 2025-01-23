import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EAppType } from 'src/common/enums/config.enum';
import { PaginationQuery } from 'src/common/query';

export class QueryRequestTypeDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EAppType })
  @IsEnum(EAppType)
  @IsOptional()
  appTypeId: EAppType;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isActive: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}
