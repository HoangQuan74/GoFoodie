import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { ENoticeStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryNoticeDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  type: number;

  @ApiPropertyOptional()
  @IsOptional()
  appType: string;

  @ApiPropertyOptional()
  @IsOptional()
  sendType: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;

  @ApiPropertyOptional({ enum: ENoticeStatus })
  @IsEnum(ENoticeStatus)
  @ValidateIf((o) => o.status)
  status: ENoticeStatus;
}
