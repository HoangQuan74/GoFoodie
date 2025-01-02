import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class FileQueryDto {
  @ApiPropertyOptional()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  width: number;

  @ApiPropertyOptional()
  @IsPositive()
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  quality: number;
}
