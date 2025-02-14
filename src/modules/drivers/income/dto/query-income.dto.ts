import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';
import { TimeRange } from 'src/common/enums';

export class QueryIncomeDto {
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value).startOf('day').toDate() : value)
    startDate?: Date;

    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    @Transform(({ value }) => value ? moment(value).endOf('day').toDate() : value)
    endDate?: Date;

    @ApiProperty({ type: String, enum: TimeRange })
    @IsEnum(TimeRange)
    type: TimeRange;
}
