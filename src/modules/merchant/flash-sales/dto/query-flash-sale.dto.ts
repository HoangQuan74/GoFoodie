import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { PaginationQuery } from 'src/common/query';
import { EFlashSaleStatus } from 'src/common/enums';

export class QueryFlashSaleDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EFlashSaleStatus })
  @IsOptional()
  @IsEnum(EFlashSaleStatus)
  @ValidateIf((o) => o.status)
  status: EFlashSaleStatus;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}
