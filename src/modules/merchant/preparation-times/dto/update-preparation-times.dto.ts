import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsPositive, Max, Min, ValidateNested } from 'class-validator';

export class UpdatePreparationTimeDto {
  @ApiProperty({ description: 'Thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)' })
  @IsIn([0, 1, 2, 3, 4, 5, 6])
  dayOfWeek: number;

  @ApiProperty({ description: 'Giờ mở cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  startTime: number;

  @ApiProperty({ description: 'Giờ đóng cửa (phút)' })
  @IsInt()
  @Min(0)
  @Max(24 * 60 - 1)
  endTime: number;

  @ApiProperty({ description: 'Thời gian chuẩn bị (phút)' })
  @IsInt()
  @IsPositive()
  preparationTime: number;
}

export class UpdatePreparationTimesDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  preparationTime: number;

  @ApiProperty({ type: [UpdatePreparationTimeDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdatePreparationTimeDto)
  preparationTimes: UpdatePreparationTimeDto[];
}
