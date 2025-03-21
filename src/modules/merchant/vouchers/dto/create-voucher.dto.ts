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
  IsUUID,
  Matches,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EXCEPTIONS } from 'src/common/constants';
import { ERefundType, EDiscountType, EVoucherType } from 'src/common/enums/voucher.enum';
import { IdDto } from 'src/common/query';

@ValidatorConstraint({ name: 'DiscountValueConstraint', async: false })
class DiscountValueConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const object = args.object as any;
    return object.discountType !== EDiscountType.Percentage || value < 100;
  }

  defaultMessage() {
    return 'Discount value must be less than 100%';
  }
}

@ValidatorConstraint({ name: 'MaxDiscountValueConstraint', async: false })
class MaxDiscountValueConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const object = args.object as any;
    return (
      object.discountType !== EDiscountType.Percentage ||
      value >= object.minOrderValue * object.discountValue * 0.01 ||
      !object.minOrderValue
    );
  }

  defaultMessage() {
    return 'Max discount value must be greater than or equal to min order value * discount value';
  }
}

export class CreateVoucherDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: [EVoucherType.Product, EVoucherType.Store] })
  @IsEnum([EVoucherType.Product, EVoucherType.Store])
  typeId: EVoucherType.Product | EVoucherType.Store;

  @ApiProperty()
  @IsUUID()
  imageId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(5)
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, { message: EXCEPTIONS.INVALID_VOUCHER_CODE })
  @IsOptional()
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

  @ApiProperty({ enum: EDiscountType })
  @IsEnum(EDiscountType)
  discountType: EDiscountType;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Validate(DiscountValueConstraint)
  discountValue: number;

  @ApiProperty({ description: 'Min order value to use voucher' })
  @IsNumber()
  @Min(0)
  minOrderValue: number;

  @ApiProperty({ description: 'Max discount value of voucher' })
  @IsNumber()
  @Validate(MaxDiscountValueConstraint)
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

  @ApiProperty({ type: [IdDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => IdDto)
  products: IdDto[];
}
