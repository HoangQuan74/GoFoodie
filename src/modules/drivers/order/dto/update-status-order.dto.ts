import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';
import { EOrderStatus } from 'src/common/enums/order.enum';

export class UpdateStatusDto {
  @ApiPropertyOptional({ enum: EOrderStatus })
  @IsEnum(EOrderStatus)
  @ValidateIf((o) => o.status !== undefined)
  @IsOptional()
  status?: EOrderStatus;
}
