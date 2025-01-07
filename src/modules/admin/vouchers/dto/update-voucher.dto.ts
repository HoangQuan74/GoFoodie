import { PartialType, OmitType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateVoucherDto extends PartialType(OmitType(CreateVoucherDto, ['code', 'typeId'] as const)) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
