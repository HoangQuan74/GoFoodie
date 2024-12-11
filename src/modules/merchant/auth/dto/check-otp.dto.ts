import { OmitType } from '@nestjs/swagger';
import { ResetPasswordByEmailDto } from './reset-password.dto';

export class CheckOtpDto extends OmitType(ResetPasswordByEmailDto, ['password'] as const) {}
