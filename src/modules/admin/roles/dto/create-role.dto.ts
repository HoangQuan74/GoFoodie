import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

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

  @ApiPropertyOptional({ type: [CreateRoleOperationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => CreateRoleOperationDto)
  operations: CreateRoleOperationDto[];
}
