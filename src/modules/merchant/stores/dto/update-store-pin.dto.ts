import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateStorePinDto {
  @ApiProperty()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  pin: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.oldPin)
  idToken: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  @ValidateIf((o) => !o.idToken)
  oldPin: string;
}
