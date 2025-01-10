import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { EXCEPTIONS } from 'src/common/constants';
import { ERefundType, EVoucherDiscountType } from 'src/common/enums/voucher.enum';
import { IdDto } from 'src/common/query';

export class CreateVoucherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  serviceTypeId: number;

  @ApiProperty()
  @IsInt()
  typeId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, { message: EXCEPTIONS.INVALID_VOUCHER_CODE })
  code: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ enum: ERefundType })
  @IsEnum(ERefundType)
  refundType: ERefundType;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isCanSave: boolean;

  @ApiProperty({ enum: EVoucherDiscountType })
  @IsEnum(EVoucherDiscountType)
  discountType: EVoucherDiscountType;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  discountValue: number;

  @ApiProperty({ description: 'Min order value to use voucher' })
  @IsNumber()
  minOrderValue: number;

  @ApiProperty({ description: 'Max discount value of voucher' })
  @IsNumber()
  @IsOptional()
  maxDiscountValue: number;

  @ApiProperty({ description: 'Is voucher private' })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ description: 'Max use time of voucher' })
  @IsNumber()
  @Min(1)
  maxUseTime: number;

  @ApiProperty({ description: 'Max use time per user of voucher' })
  @IsNumber()
  @Min(1)
  maxUseTimePerUser: number;

  @ApiProperty()
  @IsBoolean()
  isAllProducts: boolean;

  @ApiProperty({ type: [IdDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => IdDto)
  products: IdDto[];
}
