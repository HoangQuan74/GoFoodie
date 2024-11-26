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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EStoreRepresentativeType } from 'src/common/enums';

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
  @IsPhoneNumber('VN')
  phone: string;

  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  otherPhone: string;

  @ApiPropertyOptional()
  @IsEmail()
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
  @IsString()
  @IsNotEmpty()
  storeCode: string;

  //Khu vực kinh doanh
  @ApiProperty()
  @IsInt()
  businessAreaId: number;

  //Loại hình dịch vụ
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  //Tên cửa hàng
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  // món đặc trưng của quán
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  specialDish: string;

  // nhóm dịch vụ
  @ApiProperty()
  @IsInt()
  serviceGroupId: number;

  // tỉnh/thành phố
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  provinceId: number;

  // quận/huyện
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  districtId: number;

  // phường/xã
  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  wardId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  // ảnh đại diện của cửa hàng
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  @IsNotEmpty()
  storeAvatar: string;

  // ảnh bìa của cửa hàng
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeCover: string;

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
