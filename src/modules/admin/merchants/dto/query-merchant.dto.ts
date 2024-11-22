import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { EMerchantStatus, ESortMerchant } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryMerchantDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsOptional()
  status: EMerchantStatus;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional({ enum: ESortMerchant })
  @IsOptional()
  sort: ESortMerchant = ESortMerchant.CreatedAtDesc;
}
