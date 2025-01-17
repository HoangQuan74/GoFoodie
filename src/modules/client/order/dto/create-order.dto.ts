import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The ID of the cart to create the order from',
    example: 1,
  })
  @IsNumber()
  cartId: number;

  @ApiProperty({
    description: 'The delivery address for the order',
    example: '123 Main St, Anytown, AN 12345',
  })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    description: 'The latitude coordinate of the delivery location',
    example: 40.7128,
  })
  @IsNumber()
  deliveryLatitude: number;

  @ApiProperty({
    description: 'The longitude coordinate of the delivery location',
    example: -74.006,
  })
  @IsNumber()
  deliveryLongitude: number;

  @ApiProperty({
    description: 'Additional notes for the order',
    required: false,
    example: 'Please leave at the front door',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
