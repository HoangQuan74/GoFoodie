import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';
import { ECardType } from 'src/common/enums';

export class CreateCardDto {
  @ApiProperty()
  @IsInt()
  bankId: number;

  @ApiProperty({ enum: ECardType })
  @IsEnum(ECardType)
  @IsNotEmpty()
  type: ECardType;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  cardNumber: string;

  @ApiProperty()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
  @IsNotEmpty()
  expiryDate: string;

  @ApiProperty()
  @Matches(/^[0-9]{3,4}$/)
  @IsNotEmpty()
  cvv: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  @IsOptional()
  phoneNumber: string;
}
