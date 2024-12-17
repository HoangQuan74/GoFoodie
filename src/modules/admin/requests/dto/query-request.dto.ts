import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { ERequestStatus, ERequestType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryRequestDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERequestStatus })
  @IsOptional()
  @IsEnum(ERequestStatus)
  @ValidateIf((o) => o.status)
  status: ERequestStatus;

  @ApiPropertyOptional({ enum: ERequestType })
  @IsOptional()
  @IsEnum(ERequestType)
  @ValidateIf((o) => o.type)
  type: ERequestType;

  @ApiPropertyOptional()
  @IsOptional()
  productCategoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}
