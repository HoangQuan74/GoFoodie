import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsBoolean, IsEnum } from 'class-validator';
import { EStorePrintConfirmType, EStorePrintType } from 'src/common/enums';

export class UpdatePrintSettingsDto {
  @ApiProperty()
  @IsBoolean()
  autoPrint: boolean;

  @ApiProperty({ enum: EStorePrintType })
  @IsEnum(EStorePrintType)
  printType: EStorePrintType;

  @ApiProperty({ enum: EStorePrintConfirmType, isArray: true })
  @IsEnum(EStorePrintConfirmType, { each: true })
  @ArrayMinSize(1)
  confirmTypes: EStorePrintConfirmType[];
}
