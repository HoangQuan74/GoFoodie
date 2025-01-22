import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateStoreDto, CreateStoreSpecialWorkingTimeDto } from './create-store.dto';
import { IsBoolean, IsLatitude, IsLongitude, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isPause: boolean;

  @ApiPropertyOptional()
  @IsLatitude()
  @IsOptional()
  @Type(() => Number)
  latitude: number;

  @ApiPropertyOptional()
  @IsLongitude()
  @IsOptional()
  @Type(() => Number)
  longitude: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isSpecialWorkingTime: boolean;

  @ApiPropertyOptional({ type: CreateStoreSpecialWorkingTimeDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStoreSpecialWorkingTimeDto)
  @IsOptional()
  specialWorkingTimes: CreateStoreSpecialWorkingTimeDto[];
}
