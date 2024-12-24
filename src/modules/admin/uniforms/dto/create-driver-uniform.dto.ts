import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { IdDto, IdUuidDto } from 'src/common/query';

export class CreateDriverUniformDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  deliveryFee: number;

  @ApiProperty({ type: [IdDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => IdDto)
  sizes: IdDto[];

  @ApiProperty({ type: [IdUuidDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => IdUuidDto)
  @ArrayMaxSize(5)
  uniformImages: IdUuidDto[];

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  contractFileId: string;
}
