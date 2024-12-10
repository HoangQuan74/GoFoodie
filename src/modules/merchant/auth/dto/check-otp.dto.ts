import { OmitType } from '@nestjs/swagger';
import { ResetPasswordDto } from './reset-password.dto';

export class CheckOtpDto extends OmitType(ResetPasswordDto, ['password'] as const) {}
