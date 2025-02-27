import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, ValidateNested } from 'class-validator';
import { EConfigTime } from 'src/common/enums/config-time.enum';

export class ConfigTimeDto {
  @ApiProperty({ enum: EConfigTime })
  @IsEnum(EConfigTime)
  key: EConfigTime;

  @ApiProperty()
  @IsInt()
  value: number;
}

export class UpdateConfigTimeDto {
  @ApiProperty({ type: [ConfigTimeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfigTimeDto)
  data: ConfigTimeDto[];
}
