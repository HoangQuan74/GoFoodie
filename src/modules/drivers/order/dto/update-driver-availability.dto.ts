import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateDriverAvailabilityDto {
  @ApiProperty({ description: 'Whether the driver is available or not' })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ description: "The latitude of the driver's current location" })
  @IsNumber()
  latitude: number;

  @ApiProperty({ description: "The longitude of the driver's current location" })
  @IsNumber()
  longitude: number;
}
