import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EMerchantStatus, ESortMerchant } from 'src/common/enums';
import { PaginationQuery } from 'src/common/query';

export class QueryMerchantDto extends PaginationQuery {
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

  @ApiPropertyOptional()
  @IsOptional()
  createdAtFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  createdAtTo: Date;
}

export class SearchMerchantByEmailPhoneDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
