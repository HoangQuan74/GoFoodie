import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class ApproveStoreDto {
  @ApiProperty()
  @IsString()
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
