import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsInt()
  duration: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty()
  @IsBoolean()
  isLimitedBudget: boolean;

  @ApiProperty()
  @IsInt()
  budget: number;

  @ApiProperty()
  @IsNumber()
  reward: number;

  @ApiProperty()
  @IsString()
  positionValue: string;

  @ApiProperty()
  @IsInt()
  typeId: number;

  @ApiProperty()
  @IsInt()
  serviceTypeId: number;

  @ApiProperty()
  criteria: { type: string; value: string }[];

  @ApiProperty()
  @IsUUID()
  imageId: string;
}
