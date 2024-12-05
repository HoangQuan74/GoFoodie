import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EServiceGroupStatus } from 'src/common/enums';

export class CreateServiceGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ enum: EServiceGroupStatus })
  @IsEnum(EServiceGroupStatus)
  status: EServiceGroupStatus;
}
