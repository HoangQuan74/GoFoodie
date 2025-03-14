import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { EUserType } from 'src/common/enums';

export class UpdateOrderGroupDto {
  @ApiProperty()
  @IsNumber()
  orderItemId: number;

  @ApiProperty()
  @IsEnum([EUserType.Client, EUserType.Merchant])
  sortType: EUserType;

  index: number;
}

export class UpdateOrderGroupItemDto {
  @ApiProperty({ type: () => [UpdateOrderGroupDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderGroupDto)
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      const seenOrderItems = new Map<number, string>();

      value.forEach((item, index) => {
        item.index = index;

        if (!seenOrderItems.has(item.orderItemId)) {
          seenOrderItems.set(item.orderItemId, item.sortType);
        } else {
          const firstSortType = seenOrderItems.get(item.orderItemId);
          if (firstSortType === EUserType.Merchant && item.sortType === EUserType.Client) {
            return;
          }
          if (firstSortType === EUserType.Client && item.sortType === EUserType.Merchant) {
            throw new BadRequestException(
              `Lỗi sắp xếp: orderItemId ${item.orderItemId} có client đứng trước merchant!`,
            );
          }
        }
      });

      return value;
    }
    return value;
  })
  orderItems: UpdateOrderGroupDto[];
}
