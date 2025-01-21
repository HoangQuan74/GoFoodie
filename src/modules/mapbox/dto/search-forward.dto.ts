import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class SearchForwardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  search: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number = 5;
}
