import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCardDto {
  @ApiProperty()
  @IsString()
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cardHolder: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
