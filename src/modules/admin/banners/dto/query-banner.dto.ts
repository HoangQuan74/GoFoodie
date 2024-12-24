import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EBannerType } from 'src/common/enums';
import { EAppType } from 'src/common/enums/config.enum';
import { PaginationQuery } from 'src/common/query';

export class QueryBannerDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EBannerType })
  @IsEnum(EBannerType)
  @ValidateIf((o) => o.type)
  type: EBannerType;

  @ApiPropertyOptional({ enum: EAppType })
  @IsEnum(EAppType)
  @ValidateIf((o) => o.appType)
  appType: EAppType;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startDateFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startDateTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDateFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDateTo: Date;
}
