import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationQuery } from 'src/common/query';

export class QueryStoresDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  productCategoryCode: string;
}
