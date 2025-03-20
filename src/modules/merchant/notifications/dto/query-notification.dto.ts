import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { EStoreNotificationType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryNotificationDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isRead: boolean;

  @ApiPropertyOptional({ enum: EStoreNotificationType })
  @IsOptional()
  @IsEnum(EStoreNotificationType)
  type: EStoreNotificationType;
}
