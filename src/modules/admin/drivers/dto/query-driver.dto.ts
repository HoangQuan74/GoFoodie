import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginationQuery } from 'src/common/query';

export class QueryDriverDto extends PaginationQuery {}
