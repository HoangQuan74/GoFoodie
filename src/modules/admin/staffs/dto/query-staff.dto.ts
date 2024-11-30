import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EMerchantStatus, ESortMerchant } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryStaffDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsOptional()
  @IsEnum(EMerchantStatus)
  @ValidateIf((o) => o.status)
  status: EMerchantStatus;

  @ApiPropertyOptional({ enum: ESortMerchant })
  @IsOptional()
  @IsEnum(ESortMerchant)
  @ValidateIf((o) => o.sort)
  sort: ESortMerchant = ESortMerchant.CreatedAtDesc;
}
