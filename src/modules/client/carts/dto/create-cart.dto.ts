import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  optionIds: number[];
}
