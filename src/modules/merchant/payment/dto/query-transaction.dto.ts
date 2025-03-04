import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ETransactionStatus, ETransactionType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryTransactionDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: ETransactionStatus })
  @IsEnum(ETransactionStatus)
  @IsOptional()
  status: ETransactionStatus;

  @ApiPropertyOptional({ enum: ETransactionType })
  @IsEnum(ETransactionType)
  @IsOptional()
  type: ETransactionType;

  @ApiPropertyOptional()
  @IsOptional()
  startDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endDate: Date;
}
