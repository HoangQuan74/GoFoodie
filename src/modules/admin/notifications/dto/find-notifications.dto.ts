import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EUserType } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class FindNotificationsDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' && value ? value === 'true' : value))
  isRead: boolean;

  @ApiPropertyOptional()
  @IsEnum(EUserType)
  @ValidateIf((o) => o.userType)
  @IsOptional()
  userType: EUserType;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}
