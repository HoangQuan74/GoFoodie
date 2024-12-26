import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { EOnlineTrainingType } from 'src/common/enums';
import { IdUuidDto } from 'src/common/query';

export class CreateOnlineTrainingItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: [IdUuidDto] })
  @ValidateNested({ each: true })
  @Type(() => IdUuidDto)
  @ArrayMaxSize(10)
  images: IdUuidDto[];

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  videoId: string;

  @ApiProperty({ enum: EOnlineTrainingType })
  @IsEnum(EOnlineTrainingType)
  type: EOnlineTrainingType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testLink: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  testDescription: string;
}

export class CreateOnlineTrainingDto {
  @ApiProperty({ type: [CreateOnlineTrainingItemDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateOnlineTrainingItemDto)
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  items: CreateOnlineTrainingItemDto[];
}
