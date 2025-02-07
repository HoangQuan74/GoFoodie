import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ERoleStatus } from 'src/common/enums';
import { IdDto } from 'src/common/query';

export class CreateRoleOperationDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;
}

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ enum: ERoleStatus })
  @IsEnum(ERoleStatus)
  status: ERoleStatus;

  @ApiPropertyOptional({ type: [IdDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  operations: IdDto[];

  @ApiPropertyOptional({ type: [IdDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  provinces: IdDto[];

  @ApiPropertyOptional({ type: [IdDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IdDto)
  serviceTypes: IdDto[];
}
