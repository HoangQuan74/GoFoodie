import { PaginationQuery } from './../../../../common/query/base.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, ValidateIf } from 'class-validator';
import { OrderStatus, PaymentStatus } from 'src/database/entities/order.entity';

export class QueryOrderDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @ValidateIf((o) => o.status !== undefined)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  @ValidateIf((o) => o.paymentStatus !== undefined)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value === 'true' : value))
  isDelivered?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  storeId?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  keyword?: string;

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

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  minTotalAmount?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxTotalAmount?: number;
}
