import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean, IsPhoneNumber, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStoreDto {
  /* Thông tin của hàng */

  //Khu vực kinh doanh
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  businessAreaId: string;

  //Loại hình dịch vụ
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  //Tên cửa hàng
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  storeName: string;

  // món đặc trưng của quán
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  specialDish: string;

  // nhóm dịch vụ
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serviceGroup: string;

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


  /* Thông tin người đaị diện */
}
