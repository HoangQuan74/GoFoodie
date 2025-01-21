import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtTo: Date;
}

export class QueryRequestMerchantDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ERequestStatus })
  @IsOptional()
  @IsEnum(ERequestStatus)
  @ValidateIf((o) => o.status)
  status: ERequestStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  typeId: number;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  approvedAtTo: Date;
}
