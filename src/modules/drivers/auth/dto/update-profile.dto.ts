import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  IsOptional,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EXCEPTIONS } from 'src/common/constants';

export class CreateDriverBankDto {
  @ApiProperty()
  @IsInt()
  bankId: number;

  @ApiProperty()
  @IsInt()
  bankBranchId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName: string;
}

export class CreateDriverServiceTypeDto {
  @ApiProperty()
  @IsInt()
  id: number;
}

export class CreateDriverVehicleImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateDriverEmergencyContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  phoneNumber: string;

  @ApiProperty()
  @IsInt()
  relationshipId: number;
}

export class CreateDriverVehicleDto {
  @ApiProperty({ type: [CreateDriverVehicleImageDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateDriverVehicleImageDto)
  @IsNotEmpty()
  vehicleImages: CreateDriverVehicleImageDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licensePlateImageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverLicenseFrontImageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverLicenseBackImageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleRegistrationFrontImageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleRegistrationBackImageId: string;
}

export class UpdateDriverProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsEmail({}, { message: EXCEPTIONS.INVALID_EMAIL })
  email: string;

  @ApiProperty()
  @IsInt()
  activeAreaId: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  temporaryAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityCardFrontId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  identityCardBackId: string;

  @ApiProperty({ type: [CreateDriverBankDto] })
  // @ValidateNested({ each: true })
  @Type(() => CreateDriverBankDto)
  @IsNotEmpty()
  @ArrayMaxSize(1)
  banks: CreateDriverBankDto[];

  @ApiProperty({ type: [CreateDriverServiceTypeDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateDriverServiceTypeDto)
  @IsNotEmpty()
  serviceTypes: CreateDriverServiceTypeDto[];

  @ApiProperty({ type: [CreateDriverEmergencyContactDto] })
  // @ValidateNested({ each: true })
  @Type(() => CreateDriverEmergencyContactDto)
  @IsNotEmpty()
  @ArrayMaxSize(1)
  emergencyContacts: CreateDriverEmergencyContactDto[];

  @ApiProperty({ type: CreateDriverVehicleDto })
  // @ValidateNested()
  @Type(() => CreateDriverVehicleDto)
  @IsNotEmpty()
  vehicle: CreateDriverVehicleDto;
}
