import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Max, Min, ValidateNested } from 'class-validator';
import { IdDto } from 'src/common/query';

export class UpdateServiceTypeItemDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(4)
  id: number;

  @ApiProperty({ type: [IdDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => IdDto)
  provinces: IdDto[];
}

export class UpdateServiceTypeDto {
  @ApiProperty({ type: [UpdateServiceTypeItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => UpdateServiceTypeItemDto)
  items: UpdateServiceTypeItemDto[];
}
