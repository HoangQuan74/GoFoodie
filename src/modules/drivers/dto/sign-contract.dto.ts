import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SignContractDto {
  @ApiProperty()
  @IsUUID()
  signatureImageId: string;
}
