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
  @ApiProperty({ description: 'Thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)' })
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number;

  @ApiProperty({ description: 'Giờ mở cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  openTime: number;

  @ApiProperty({ description: 'Giờ đóng cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  closeTime: number;
}

export class CreateStoreSpecialWorkingTimeDto {
  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty({ description: 'Giờ mở cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  openTime: number;

  @ApiProperty({ description: 'Giờ đóng cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  closeTime: number;
}

export class CreateStoreHolidayDto {
  @ApiProperty()
  @IsDate()
  startTime: Date;

  @ApiProperty()
  @IsDate()
  endTime: Date;
}

export class CreateStoreBankDto {
  @ApiProperty({ description: 'Id ngân hàng' })
  @IsInt()
  bankId: string;

  @ApiProperty({ description: 'Id chi nhánh ngân hàng' })
  @IsInt()
  bankBranchId: string;

  @ApiProperty({ description: 'Số tài khoản' })
  @IsString()
  @IsNotEmpty()
  bankAccountNumber: string;

  @ApiProperty({ description: 'Tên chủ tài khoản' })
  @IsString()
  @IsNotEmpty()
  bankAccountName: string;
}

export class CreateRepresentativeDto {
  @ApiProperty({ enum: EStoreRepresentativeType, description: 'Loại người đại diện' })
  @IsEnum(EStoreRepresentativeType)
  type: EStoreRepresentativeType;

  @ApiProperty({ description: 'Tên người đại diện' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Số điện thoại người đại diện' })
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({ description: 'Số điện thoại khác' })
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  @IsOptional()
  otherPhone: string;

  @ApiPropertyOptional({ description: 'Email người đại diện' })
  @IsEmail({}, { message: EXCEPTIONS.INVALID_EMAIL })
  @IsOptional()
  email: string;

  @ApiProperty({ description: 'Mã số thuế' })
  @IsString()
  @IsNotEmpty()
  taxCode: string;

  @ApiPropertyOptional({ description: 'Địa chỉ' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ description: 'Mã số thuế cá nhân' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === EStoreRepresentativeType.Individual)
  personalTaxCode: string;

  @ApiPropertyOptional({ description: 'Số CMND' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === EStoreRepresentativeType.Individual)
  identityCard: string;

  @ApiPropertyOptional({ description: 'Nơi cấp CMND' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.status === EStoreRepresentativeType.Individual)
  identityCardPlace: string;

  @ApiPropertyOptional({ description: 'Ngày cấp CMND' })
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.type === EStoreRepresentativeType.Individual)
  identityCardDate: Date;

  @ApiPropertyOptional({ description: 'Hình ảnh CMND mặt trước' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === EStoreRepresentativeType.Individual)
  identityCardFrontImageId: string;

  @ApiPropertyOptional({ description: 'Hình ảnh CMND mặt sau' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type === EStoreRepresentativeType.Individual)
  identityCardBackImageId: string;

  @ApiPropertyOptional({ description: 'Hình ảnh giấy phép kinh doanh' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.type !== EStoreRepresentativeType.Individual)
  businessLicenseImageId: string;

  @ApiProperty({ description: 'Hình ảnh mã số thuế' })
  @IsString()
  @IsNotEmpty()
  taxLicenseImageId: string;

  @ApiPropertyOptional({ description: 'Hình ảnh liên quan' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  relatedImageId: string;
}

export class CreateStoreDto {
  @ApiProperty({ description: 'Id của merchant' })
  @IsInt()
  merchantId: number;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty({ description: 'Có kinh doanh rượu không' })
  @IsBoolean()
  @IsOptional()
  isAlcohol: boolean;

  @ApiProperty({ description: 'Id của khu vực kinh doanh' })
  @IsInt()
  @ValidateIf((o) => !o.isDraft)
  businessAreaId: number;

  @ApiProperty({ description: 'Id của loại dịch vụ' })
  @IsInt()
  @ValidateIf((o) => !o.isDraft)
  serviceTypeId: number;

  @ApiProperty({ description: 'Tên cửa hàng' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  name: string;

  @ApiPropertyOptional({ description: 'Món đặc biệt' })
  @IsString()
  @IsOptional()
  specialDish: string;

  @ApiPropertyOptional({ description: 'Tên đường' })
  @IsString()
  @IsOptional()
  streetName: string;

  @ApiProperty({ description: 'Id của nhóm dịch vụ' })
  @IsInt()
  @ValidateIf((o) => !o.isDraft)
  serviceGroupId: number;

  @ApiProperty({ description: 'Id của xã' })
  @IsInt()
  @Type(() => Number)
  @ValidateIf((o) => !o.isDraft)
  wardId: number;

  @ApiProperty({ description: 'Địa chỉ' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  address: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsPhoneNumber('VN', { message: EXCEPTIONS.INVALID_PHONE })
  @ValidateIf((o) => !o.isDraft)
  phoneNumber: string;

  @ApiProperty({ description: 'Ảnh đại diện cửa hàng' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  storeAvatarId: string;

  @ApiProperty({ description: 'Ảnh bìa cửa hàng' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  storeCoverId: string;

  @ApiProperty({ description: 'Ảnh mặt tiền cửa hàng' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  storeFrontId: string;

  @ApiProperty({ description: 'Ảnh menu cửa hàng' })
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.isDraft)
  storeMenuId: string;

  @ApiProperty({ type: CreateWorkingTimeDto, isArray: true })
  // @ValidateNested({ each: true })
  @Type(() => CreateWorkingTimeDto)
  @ValidateIf((o) => !o.isDraft)
  workingTimes: CreateWorkingTimeDto[];

  @ApiProperty({ type: CreateRepresentativeDto })
  // @ValidateNested()
  @Type(() => CreateRepresentativeDto)
  @ValidateIf((o) => !o.isDraft)
  representative: CreateRepresentativeDto;

  @ApiProperty({ type: CreateStoreBankDto, isArray: true })
  // @ValidateNested({ each: true })
  @Type(() => CreateStoreBankDto)
  @ValidateIf((o) => !o.isDraft)
  banks: CreateStoreBankDto[];

  @ApiProperty({ type: CreateStoreSpecialWorkingTimeDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStoreSpecialWorkingTimeDto)
  @IsOptional()
  specialWorkingTimes: CreateStoreSpecialWorkingTimeDto[];

  @ApiProperty({ type: CreateStoreHolidayDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => CreateStoreHolidayDto)
  @IsOptional()
  holidays: CreateStoreHolidayDto[];
}
