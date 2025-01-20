import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Additional reason when cancelling',
    required: false,
    example: 'I changed my mind',
  })
  @IsString()
  @IsOptional()
  reasons?: string;
}
