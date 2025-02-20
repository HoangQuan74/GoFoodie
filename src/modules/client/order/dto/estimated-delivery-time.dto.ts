import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsLatitude, IsLongitude, IsOptional } from 'class-validator';

export class EstimatedDeliveryTimeDto {
  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  orderDate: Date = new Date();

  @ApiProperty()
  @IsLatitude()
  @Type(() => Number)
  lat: number;

  @ApiProperty()
  @IsLongitude()
  @Type(() => Number)
  lng: number;
}
