import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AssignOrderDto {
  @ApiProperty({ description: 'The ID of the order to be assigned' })
  @IsNumber()
  orderId: number;

  @ApiPropertyOptional({ description: 'The ID of the driver to assign the order to (optional)' })
  @IsOptional()
  @IsNumber()
  driverId?: number;
}
