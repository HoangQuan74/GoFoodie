import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EOrderStatus, EPaymentStatus } from 'src/common/enums/order.enum';
import { PaginationQuery } from './../../../../common/query/base.query';

export class QueryOrderDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsEnum(EOrderStatus)
  @ValidateIf((o) => o.status !== undefined)
  @IsOptional()
  status?: EOrderStatus;

  @ApiPropertyOptional({ enum: EPaymentStatus })
  @IsEnum(EPaymentStatus)
  @ValidateIf((o) => o.paymentStatus !== undefined)
  @IsOptional()
  paymentStatus?: EPaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional()
  @IsEnum(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}

export class QueryOrderHistoryDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsEnum(EOrderStatus)
  @ValidateIf((o) => o.status !== undefined)
  @IsOptional()
  status?: EOrderStatus;
}
