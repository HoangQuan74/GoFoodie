import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Additional reason when cancelling',
    required: false,
    example: 'Out of stock',
  })
  @IsString()
  @IsOptional()
  reasons?: string;
}
