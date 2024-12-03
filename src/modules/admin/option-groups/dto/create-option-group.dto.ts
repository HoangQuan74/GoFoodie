import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { EOptionGroupStatus } from 'src/common/enums';

export class CreateOptionGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsInt()
  storeId: number;

  @ApiProperty()
  @IsBoolean()
  isMultiple: boolean;

  @ApiProperty({ enum: EOptionGroupStatus })
  @IsEnum(EOptionGroupStatus)
  status: EOptionGroupStatus;
}
