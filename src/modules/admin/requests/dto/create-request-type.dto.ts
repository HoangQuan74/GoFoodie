import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateAppTypeDto } from '../../cancel-order-reasons/dto/create-cancel-order-reason.dto';

export class CreateRequestTypeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: [CreateAppTypeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateAppTypeDto)
  appTypes: CreateAppTypeDto[];
}
