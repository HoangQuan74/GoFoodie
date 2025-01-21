import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EChallengeStatus } from 'src/common/enums/challenge.enum';
import { PaginationQuery } from 'src/common/query';

export class QueryChallengeDto extends PaginationQuery {
  @ApiPropertyOptional()
  @IsOptional()
  startTimeFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  startTimeTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endTimeFrom: Date;

  @ApiPropertyOptional()
  @IsOptional()
  endTimeTo: Date;

  @ApiPropertyOptional()
  @IsOptional()
  typeId: number;

  @ApiPropertyOptional({ enum: EChallengeStatus })
  @IsEnum(EChallengeStatus)
  @ValidateIf((o) => o.status)
  status: EChallengeStatus;
}
