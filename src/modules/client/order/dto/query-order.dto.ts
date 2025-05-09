import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EOrderCode, EOrderStatus, EPaymentStatus } from 'src/common/enums/order.enum';
import { PaginationQuery } from './../../../../common/query/base.query';
import { EUserType } from 'src/common/enums';

export class QueryOrderDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EOrderStatus, isArray: true })
  @ValidateIf((o) => o.status)
  @IsEnum(EOrderStatus, { each: true })
  @IsArray()
  @IsOptional()
  status?: EOrderStatus[];

  @ApiPropertyOptional({ enum: EPaymentStatus })
  @IsEnum(EPaymentStatus)
  @ValidateIf((o) => o.paymentStatus !== undefined)
  @IsOptional()
  paymentStatus?: EPaymentStatus;

  @ApiPropertyOptional({ enum: EUserType })
  @IsEnum(EUserType)
  @IsOptional()
  cancellationType?: EUserType;

  @ApiPropertyOptional({ enum: EOrderCode })
  @IsEnum(EOrderCode)
  @ValidateIf((o) => o.orderType !== undefined)
  @IsOptional()
  orderType?: EOrderCode;

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

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isRated?: boolean;
}
