import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsInt,
  IsIn,
  Max,
  Min,
  ValidateNested,
  IsEnum,
  ValidateIf,
  IsEmail,
  IsOptional,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EStoreRepresentativeType } from 'src/common/enums';
import { EXCEPTIONS } from 'src/common/constants';

export class CreateWorkingTimeDto {
  @ApiProperty()
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  openTime: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  closeTime: number;
}

export class CreateStoreBankDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankBranch: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankAccountName: string;
}

export class CreateRepresentativeDto {
  @ApiProperty({ enum: EStoreRepresentativeType })
  @IsEnum(EStoreRepresentativeType)
  type: EStoreRepresentativeType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  phone: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  otherPhone: string;

  @ApiPropertyOptional()
  @IsEmail({}, { message: EXCEPTIONS.INVALID_EMAIL })
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  personalTaxCode: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCard: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCardPlace: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCardDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCardFrontImageId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCardBackImageId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status !== EStoreRepresentativeType.Individual)
  businessLicenseImageId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  taxLicenseImageId: string;
}

export class CreateStoreDto {
  @ApiProperty()
  @IsInt()
  merchantId: number;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty()
  @IsBoolean()
  isAlcohol: boolean;

  @ApiProperty()
  @IsInt()
  businessAreaId: number;

  @ApiProperty()
  @IsInt()
  serviceTypeId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specialDish: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  streetName: string;

  @ApiProperty()
  @IsInt()
  serviceGroupId: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  wardId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeAvatarId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeCoverId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeFrontId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeMenuId: string;

  @ApiProperty({ type: CreateWorkingTimeDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingTimeDto)
  workingTimes: CreateWorkingTimeDto[];

  @ApiProperty({ type: CreateRepresentativeDto })
  @ValidateNested()
  @Type(() => CreateRepresentativeDto)
  representative: CreateRepresentativeDto;

  @ApiProperty({ type: CreateStoreBankDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStoreBankDto)
  banks: CreateStoreBankDto[];
}
