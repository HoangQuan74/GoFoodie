import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EMerchantStatus, ESortMerchant } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryMerchantDto extends PaginationQuery {
  @ApiPropertyOptional({ enum: EMerchantStatus })
  @IsOptional()
  @IsEnum(EMerchantStatus)
  status: EMerchantStatus;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional({ enum: ESortMerchant })
  @IsOptional()
  @IsEnum(ESortMerchant)
  sort: ESortMerchant;
}
