import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { IdDto } from 'src/common/query';

export class ReviewDriverDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({ type: [IdDto] })
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  @IsArray()
  templates: IdDto[];
}
