import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { comparePassword, generateOTP, hashPassword } from 'src/utils/bcrypt';
import { JwtPayload, JwtSign } from 'src/common/interfaces';
import { EXCEPTIONS, JWT_EXPIRATION } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { MailService } from 'src/modules/mail/mail.service';
import { EAdminOtpType, EMerchantStatus, EStoreApprovalStatus, EStoreStatus } from 'src/common/enums';
import { MerchantsService } from '../merchants/merchants.service';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { Request } from 'express';
import { Brackets } from 'typeorm';

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

    const stores = merchant.store ? [merchant.store, ...merchant.stores] : merchant.stores;
    const payload: JwtPayload = { id: merchant.id, deviceToken };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
    const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(merchant.id, deviceToken);

    merchant.lastLogin = new Date();
    merchant.deviceToken = deviceToken;
    delete merchant.stores;
    await this.merchantsService.save(merchant);

    delete merchant.password;
    delete merchant.store;
    return { ...merchant, stores, accessToken, refreshToken };
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

      const stores = merchant.store ? [merchant.store, ...merchant.stores] : merchant.stores;
      const payload: JwtPayload = { id: merchant.id, deviceToken };
      const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
      const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(merchant.id, deviceToken);

      merchant.lastLogin = new Date();
      merchant.deviceToken = deviceToken;
      delete merchant.stores;
      await this.merchantsService.save(merchant);

      delete merchant.store;
      return { ...merchant, stores, accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async forgotPassword(email: string) {
    const merchant = await this.merchantsService.findOne({ where: { email } });
    if (!merchant) throw new NotFoundException();

    const otp = generateOTP();
    const otpType = EAdminOtpType.ForgotPassword;
    await this.merchantsService.deleteOtp(merchant.id, otpType);
    await this.merchantsService.saveOtp({ merchantId: merchant.id, otp, type: otpType });
    this.mailService.sendOtp(email, otp, merchant.name);

    return { message: 'OTP has been sent to your email' };
  }

  async resetPassword(otp: string, email: string, password: string) {
    const admin = await this.merchantsService.findOne({ where: { email } });
    if (!admin) throw new NotFoundException();

    const isValidOtp = await this.merchantsService.validateOtp(admin.id, otp);
    if (!isValidOtp) throw new UnauthorizedException();

    const hashedPassword = hashPassword(password);
    admin.password = hashedPassword;
    await this.merchantsService.save(admin);
    await this.merchantsService.deleteOtp(admin.id, EAdminOtpType.ForgotPassword);
  }

  async changePassword(adminId: number, currentPassword: string, newPassword: string) {
    const merchant = await this.merchantsService.findOne({ where: { id: adminId }, select: ['id', 'password'] });
    if (!merchant) throw new NotFoundException();

    if (merchant.password) {
      const isPasswordMatching = comparePassword(currentPassword, merchant.password);
      if (!isPasswordMatching) throw new UnauthorizedException();
    }

    const hashedPassword = hashPassword(newPassword);
    merchant.password = hashedPassword;
    await this.merchantsService.save(merchant);
  }

  async refreshToken(refreshToken: string, req: Request): Promise<JwtSign> {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      const { id, storeId } = this.jwtService.verify(accessToken, { ignoreExpiration: true });

      const { deviceToken } = await this.refreshTokensService.findValidToken(refreshToken, id);
      const merchant = await this.merchantsService.findOne({ where: { id } });
      if (!merchant) throw new UnauthorizedException();

      const newPayload: JwtPayload = { id: merchant.id, deviceToken, storeId };
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

  async loginStore(merchantId: number, deviceToken: string, storeId: number): Promise<JwtSign> {
    const merchant = await this.merchantsService
      .createQueryBuilder('merchant')
      .leftJoin('merchant.store', 'store')
      .leftJoin('merchant.stores', 'stores')
      .where('merchant.id = :id', { id: merchantId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('merchant.storeId = :storeId AND store.status = :status AND store.approvalStatus = :approvalStatus');
          qb.orWhere('stores.id = :storeId AND stores.status = :status AND stores.approvalStatus = :approvalStatus');
        }),
      )
      .setParameter('storeId', storeId)
      .setParameter('status', EStoreStatus.Active)
      .setParameter('approvalStatus', EStoreApprovalStatus.Approved)
      .getOne();
    if (!merchant) throw new NotFoundException();

    const payload: JwtPayload = { id: merchantId, deviceToken, storeId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
    const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(merchantId, deviceToken);

    return { accessToken, refreshToken };
  }

  async registerEmail(email: string) {
    let merchant = await this.merchantsService.findOne({ where: { email } });

    if (!merchant) {
      merchant = await this.merchantsService.save({ email });
    }

    if (merchant.emailVerifiedAt) throw new UnauthorizedException(EXCEPTIONS.EMAIL_CONFLICT);

    const otp = generateOTP();
    await this.merchantsService.deleteOtp(merchant.id, EAdminOtpType.VerifyEmail);
    await this.merchantsService.saveOtp({ merchantId: merchant.id, otp, type: EAdminOtpType.VerifyEmail });
    this.mailService.sendOtp(email, otp, email);
  }

  async registerEmailCompleted(otp: string, email: string, password: string) {
    const merchant = await this.merchantsService.findOne({ where: { email } });
    if (!merchant) throw new NotFoundException();

    const isValidOtp = await this.merchantsService.validateOtp(merchant.id, otp);
    if (!isValidOtp) throw new UnauthorizedException();

    const hashedPassword = hashPassword(password);
    merchant.password = hashedPassword;
    merchant.emailVerifiedAt = new Date();
    await this.merchantsService.save(merchant);
    await this.merchantsService.deleteOtp(merchant.id, EAdminOtpType.VerifyEmail);
  }

  async checkOtp(email: string, otp: string) {
    const merchant = await this.merchantsService.findOne({ where: { email } });
    if (!merchant) throw new NotFoundException();

    const isValidOtp = await this.merchantsService.validateOtp(merchant.id, otp);
    if (!isValidOtp) throw new UnauthorizedException();
  }
}
