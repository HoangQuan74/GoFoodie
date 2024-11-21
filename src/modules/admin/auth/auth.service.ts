import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { comparePassword, generateOTP, hashPassword } from 'src/utils/bcrypt';
import { JwtPayload, JwtSign } from 'src/common/interfaces';
import { JWT_EXPIRATION, JWT_SECRET } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { AdminsService } from '../admins/admins.service';
import { AdminEntity } from 'src/database/entities/admin.entity';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { MailService } from 'src/modules/mail/mail.service';
import { EAdminOtpType } from 'src/common/enums';

@Injectable()
export class AuthService {
  constructor(
    private adminsService: AdminsService,
    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
    private mailService: MailService,
  ) {}

  async signIn(username: string, password: string): Promise<Omit<AdminEntity, 'password'> & JwtSign> {
    const admin = await this.adminsService.findOne({
      where: [{ username }, { email: username }],
      select: ['id', 'username', 'email', 'password'],
    });
    if (!admin) throw new UnauthorizedException();

    const isPasswordMatching = comparePassword(password, admin.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    const payload: JwtPayload = { id: admin.id };
    const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: JWT_EXPIRATION });
    const { token } = await this.refreshTokensService.createRefreshToken(admin.id);

    admin.lastLogin = new Date();
    this.adminsService.save(admin);

    delete admin.password;
    return { ...admin, accessToken, refreshToken: token };
  }

  async forgotPassword(email: string) {
    const admin = await this.adminsService.findOne({ where: { email } });
    if (!admin) throw new NotFoundException();

    const otp = generateOTP();
    const otpType = EAdminOtpType.ForgotPassword;
    await this.adminsService.deleteOtp(admin.id, otpType);
    await this.adminsService.saveOtp({ adminId: admin.id, otp, type: otpType });
    await this.mailService.sendForgotPasswordForAdmin(admin.email, otp);

    return { message: 'OTP has been sent to your email' };
  }

  async resetPassword(otp: string, email: string, password: string) {
    const admin = await this.adminsService.findOne({ where: { email } });
    if (!admin) throw new NotFoundException();

    const isValidOtp = await this.adminsService.validateOtp(admin.id, otp);
    if (!isValidOtp) throw new UnauthorizedException();

    const hashedPassword = hashPassword(password);
    admin.password = hashedPassword;
    await this.adminsService.save(admin);
    await this.adminsService.deleteOtp(admin.id, EAdminOtpType.ForgotPassword);
  }

  async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const admin = await this.adminsService.findOne({ where: { id: adminId }, select: ['id', 'password'] });
    if (!admin) throw new NotFoundException();

    const isPasswordMatching = comparePassword(currentPassword, admin.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    const hashedPassword = hashPassword(newPassword);
    admin.password = hashedPassword;
    await this.adminsService.save(admin);
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenEntity = await this.refreshTokensService.findValidToken(refreshToken);
    if (!refreshTokenEntity) throw new UnauthorizedException();

    const admin = await this.adminsService.findOne({ where: { id: refreshTokenEntity.adminId } });
    if (!admin) throw new UnauthorizedException();

    const payload: JwtPayload = { id: admin.id };
    const accessToken = this.jwtService.sign(payload, { secret: JWT_SECRET, expiresIn: JWT_EXPIRATION });

    this.refreshTokensService.revokeToken(admin.id, refreshToken);
    const { token } = await this.refreshTokensService.createRefreshToken(admin.id);

    return { accessToken, refreshToken: token };
  }

  async checkOtp(email: string, otp: string) {
    const admin = await this.adminsService.findOne({ where: { email } });
    if (!admin) throw new NotFoundException();

    const isValidOtp = await this.adminsService.validateOtp(admin.id, otp);
    if (!isValidOtp) throw new UnauthorizedException();
  }
}
