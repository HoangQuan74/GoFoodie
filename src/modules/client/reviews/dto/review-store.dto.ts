import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { IdDto, IdUuidDto } from 'src/common/query';

export class ReviewStoreDto {
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

  @ApiProperty()
  @IsBoolean()
  isAnonymous: boolean;

  @ApiProperty({ type: [IdDto] })
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  @IsArray()
  templates: IdDto[];

  @ApiProperty({ type: [IdUuidDto] })
  @ValidateNested({ each: true })
  @Type(() => IdUuidDto)
  @IsArray()
  files: IdUuidDto[];
}
