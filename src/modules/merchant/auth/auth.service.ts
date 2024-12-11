import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { JwtPayload, JwtSign } from 'src/common/interfaces';
import { EXCEPTIONS, JWT_EXPIRATION, JWT_SECRET } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { MailService } from 'src/modules/mail/mail.service';
import { EMerchantStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { MerchantsService } from '../merchants/merchants.service';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private merchantsService: MerchantsService,
    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
    private firebaseService: FirebaseService,
    private mailService: MailService,
  ) {}

  async signIn(
    username: string,
    password: string,
    deviceToken: string,
  ): Promise<Omit<MerchantEntity, 'password'> & JwtSign> {
    const merchant = await this.merchantsService
      .createQueryBuilder('merchant')
      .where('merchant.phone = :phone OR merchant.email = :email', { phone: username, email: username })
      .select(['merchant.id', 'merchant.phone', 'merchant.email', 'merchant.password', 'merchant.status'])
      .addSelect(['store.id', 'store.name'])
      .addSelect(['stores.id', 'stores.name'])
      .leftJoin('merchant.store', 'store', 'store.status = :status AND store.approvalStatus = :approvalStatus')
      .leftJoin('merchant.stores', 'stores', 'stores.status = :status AND stores.approvalStatus = :approvalStatus')
      .setParameter('status', EStoreStatus.Active)
      .setParameter('approvalStatus', EStoreApprovalStatus.Approved)
      .getOne();

    if (!merchant) throw new UnauthorizedException();

    const isPasswordMatching = comparePassword(password, merchant.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    if (merchant.status !== EMerchantStatus.Active) throw new UnauthorizedException(EXCEPTIONS.ACCOUNT_NOT_ACTIVE);

    const payload: JwtPayload = { id: merchant.id, deviceToken };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
    const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(merchant.id, deviceToken);

    merchant.lastLogin = new Date();
    merchant.deviceToken = deviceToken;
    this.merchantsService.save(merchant);
    merchant.store && merchant.stores.push(merchant.store);

    delete merchant.password;
    delete merchant.store;
    return { ...merchant, accessToken, refreshToken };
  }

  async signInWithSms(idToken: string, deviceToken: string): Promise<Omit<MerchantEntity, 'password'> & JwtSign> {
    try {
      const { phone_number } = await this.firebaseService.verifyIdToken(idToken);
      const phone = phone_number.replace('+', '');

      let merchant = await this.merchantsService
        .createQueryBuilder('merchant')
        .where('merchant.phone = :phone', { phone })
        .addSelect(['store.id', 'store.name'])
        .addSelect(['stores.id', 'stores.name'])
        .leftJoin('merchant.store', 'store', 'store.status = :status AND store.approvalStatus = :approvalStatus')
        .leftJoin('merchant.stores', 'stores', 'stores.status = :status AND stores.approvalStatus = :approvalStatus')
        .setParameter('status', EStoreStatus.Active)
        .setParameter('approvalStatus', EStoreApprovalStatus.Approved)
        .getOne();

      if (!merchant) {
        merchant = new MerchantEntity();
        merchant.phone = phone;
        merchant = await this.merchantsService.save(merchant);
      }

      if (merchant.status !== EMerchantStatus.Active) throw new UnauthorizedException(EXCEPTIONS.ACCOUNT_NOT_ACTIVE);

      const payload: JwtPayload = { id: merchant.id, deviceToken };
      const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
      const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(merchant.id, deviceToken);

      merchant.lastLogin = new Date();
      merchant.deviceToken = deviceToken;
      this.merchantsService.save(merchant);
      merchant.store && merchant.stores.push(merchant.store);

      delete merchant.store;
      return { ...merchant, accessToken, refreshToken };
    } catch (error) {}
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

  async refreshToken(refreshToken: string, req: Request): Promise<JwtSign> {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      const { id } = this.jwtService.verify(accessToken, { ignoreExpiration: true });

      const { deviceToken } = await this.refreshTokensService.findValidToken(refreshToken, id);
      const merchant = await this.merchantsService.findOne({ where: { id } });
      if (!merchant) throw new UnauthorizedException();

      const newPayload: JwtPayload = { id: merchant.id, deviceToken: deviceToken };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: JWT_EXPIRATION });

      await this.refreshTokensService.revokeToken(merchant.id, refreshToken);
      const { token } = await this.refreshTokensService.createRefreshToken(merchant.id, deviceToken);

      return { accessToken: newAccessToken, refreshToken: token };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(req: Request) {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];

      const { id } = this.jwtService.verify(accessToken, { ignoreExpiration: true });
      return this.refreshTokensService.revokeAllTokens(id);
    } catch (error) {
      return;
    }
  }
}
