import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EAppType } from 'src/common/enums/config.enum';

export class CreateRequestTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ enum: EAppType })
  @IsEnum(EAppType)
  appTypeId: EAppType;
}
