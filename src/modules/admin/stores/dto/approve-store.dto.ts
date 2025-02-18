import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsLatitude, IsLongitude } from 'class-validator';

export class ApproveStoreDto {
  @ApiProperty()
  @IsInt()
  address: string;

  @ApiProperty()
  @IsLatitude()
  @Type(() => Number)
  latitude: number;

  @ApiProperty()
  @IsLongitude()
  @Type(() => Number)
  longitude: number;
}
