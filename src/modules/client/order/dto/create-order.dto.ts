import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { EOrderCode, EPaymentStatus } from 'src/common/enums/order.enum';

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
    description: 'The delivery phone for the order',
    example: '012355646',
  })
  @IsPhoneNumber('VN')
  @ValidateIf((o) => o.deliveryPhone)
  deliveryPhone: string;

  @ApiProperty({
    description: 'The delivery name for the order',
    example: 'Joe Smith',
  })
  @IsString()
  deliveryName: string;

  @ApiProperty({
    description: 'The delivery address notes for the order',
    example: '123 Main St, Anytown, AN 12345',
  })
  @IsString()
  deliveryAddressNote: string;

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

  @ApiPropertyOptional()
  @IsInt()
  @Min(1000)
  @Max(200000)
  @IsOptional()
  tip?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  eatingTools?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  promoPrice?: number;

  @ApiPropertyOptional({ enum: EOrderCode })
  @IsEnum(EOrderCode)
  @ValidateIf((o) => o.orderType !== undefined)
  @IsOptional()
  orderType?: EOrderCode;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  estimatedOrderTime?: Date;
}
