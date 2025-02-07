import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { ERoleStatus } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class FindRolesDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERoleStatus })
  @IsEnum(ERoleStatus)
  @IsOptional()
  @ValidateIf((o) => o.status)
  status: ERoleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  provinceId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  serviceTypeId: number;
}
