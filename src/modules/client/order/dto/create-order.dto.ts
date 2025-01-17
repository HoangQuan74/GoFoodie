import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  clientId: number;

  @IsNumber()
  cartId: number;

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  deliveryLatitude: number;

  @IsNumber()
  deliveryLongitude: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
