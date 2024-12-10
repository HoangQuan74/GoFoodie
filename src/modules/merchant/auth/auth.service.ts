import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { JwtPayload, JwtSign } from 'src/common/interfaces';
import { EXCEPTIONS, JWT_EXPIRATION, JWT_SECRET } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
// import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { MailService } from 'src/modules/mail/mail.service';
import { EMerchantStatus } from 'src/common/enums';
import { MerchantsService } from '../merchants/merchants.service';
import { MerchantEntity } from 'src/database/entities/merchant.entity';

@Injectable()
export class AuthService {
  constructor(
    private merchantsService: MerchantsService,
    private jwtService: JwtService,
    // private refreshTokensService: RefreshTokensService,
    private mailService: MailService,
  ) {}

  async signIn(username: string, password: string): Promise<Omit<MerchantEntity, 'password'> & JwtSign> {
    const merchant = await this.merchantsService.findOne({
      where: [{ phone: username }, { email: username }],
      select: ['id', 'phone', 'email', 'password', 'status'],
    });
    if (!merchant) throw new UnauthorizedException();

    const isPasswordMatching = comparePassword(password, merchant.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    if (merchant.status !== EMerchantStatus.Active) throw new UnauthorizedException(EXCEPTIONS.ACCOUNT_NOT_ACTIVE);

    const payload: JwtPayload = { id: merchant.id };
    const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: JWT_EXPIRATION });

    delete merchant.password;
    return { ...merchant, accessToken, refreshToken: accessToken };
  }

  // async forgotPassword(email: string) {
  //   const admin = await this.merchantsService.findOne({ where: { email } });
  //   if (!admin) throw new NotFoundException();

  //   const otp = generateOTP();
  //   const otpType = EAdminOtpType.ForgotPassword;
  //   await this.adminsService.deleteOtp(admin.id, otpType);
  //   await this.adminsService.saveOtp({ adminId: admin.id, otp, type: otpType });
  //   this.mailService.sendForgotPasswordForAdmin(admin.email, otp, admin.name);

  //   return { message: 'OTP has been sent to your email' };
  // }

  // async resetPassword(otp: string, email: string, password: string) {
  //   const admin = await this.adminsService.findOne({ where: { email } });
  //   if (!admin) throw new NotFoundException();

  //   const isValidOtp = await this.adminsService.validateOtp(admin.id, otp);
  //   if (!isValidOtp) throw new UnauthorizedException();

  //   const hashedPassword = hashPassword(password);
  //   admin.password = hashedPassword;
  //   await this.adminsService.save(admin);
  //   await this.adminsService.deleteOtp(admin.id, EAdminOtpType.ForgotPassword);
  // }

  async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const merchant = await this.merchantsService.findOne({ where: { id: adminId }, select: ['id', 'password'] });
    if (!merchant) throw new NotFoundException();

    const isPasswordMatching = comparePassword(currentPassword, merchant.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    const hashedPassword = hashPassword(newPassword);
    merchant.password = hashedPassword;
    await this.merchantsService.save(merchant);
  }
}
