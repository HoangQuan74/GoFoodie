import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { EOrderCode } from 'src/common/enums/order.enum';

export class CreatePreOrderDto {
  @ApiProperty({
    description: 'The ID of the cart to create the order from',
    example: 1,
  })
  @IsNumber()
  cartId: number;

  @ApiProperty()
  @IsString()
  deliveryAddress: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @ValidateIf((o) => o.deliveryPhone)
  deliveryPhone: string;

  @ApiPropertyOptional()
  @IsString()
  deliveryName: string;

  @ApiProperty()
  @IsString()
  deliveryAddressNote: string;

  @ApiProperty()
  @IsLatitude()
  @Type(() => Number)
  deliveryLatitude: number;

  @ApiProperty()
  @IsLongitude()
  @Type(() => Number)
  deliveryLongitude: number;

  @ApiProperty()
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

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  orderTime: Date;
}
