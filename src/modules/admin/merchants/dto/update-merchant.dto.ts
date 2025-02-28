import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateMerchantDto } from './create-merchant.dto';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {}

export class UpdateMerchantByEmailPhoneDto {
  @ApiProperty({ required: false, description: 'Email to identify the merchant' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false, description: 'Phone number to identify the merchant' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'New name for the merchant' })
  @IsOptional()
  @IsString()
  name?: string;
}
