import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ERoleStatus } from 'src/common/enums';

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

  @ApiProperty()
  @IsEnum(ERoleStatus)
  status: ERoleStatus;

  @ApiPropertyOptional({ type: [CreateRoleOperationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateRoleOperationDto)
  operations: CreateRoleOperationDto[];
}
