import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DriversService } from '../drivers.service';
import { DriverEntity } from 'src/database/entities/driver.entity';
import { JwtPayload, JwtSign } from 'src/common/interfaces';
import { EDriverStatus } from 'src/common/enums/driver.enum';
import { comparePassword } from 'src/utils/bcrypt';
import { EXCEPTIONS, JWT_EXPIRATION } from 'src/common/constants';
import { JwtService } from '@nestjs/jwt';
import { FirebaseService } from 'src/modules/firebase/firebase.service';
import { RefreshTokensService } from '../refresh-tokens/refresh-tokens.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private driversService: DriversService,

    private jwtService: JwtService,
    private refreshTokensService: RefreshTokensService,
    private firebaseService: FirebaseService,
    // private mailService: MailService,
  ) {}

  async signIn(
    username: string,
    password: string,
    deviceToken: string,
  ): Promise<Omit<DriverEntity, 'password'> & JwtSign> {
    const driver = await this.driversService
      .createQueryBuilder('driver')
      .addSelect('driver.password')
      .where('driver.phoneNumber = :phone OR driver.email = :email', { phone: username, email: username })
      .getOne();

    if (!driver) throw new UnauthorizedException();

    const { id, status } = driver;
    const isPasswordMatching = comparePassword(password, driver.password);
    if (!isPasswordMatching) throw new UnauthorizedException();

    if (status !== EDriverStatus.Active) throw new UnauthorizedException(EXCEPTIONS.ACCOUNT_NOT_ACTIVE);

    const payload: JwtPayload = { id, deviceToken };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
    const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(driver.id, deviceToken);

    driver.lastLogin = new Date();
    driver.deviceToken = deviceToken;

    await this.driversService.save(driver);

    delete driver.password;
    return { ...driver, accessToken, refreshToken };
  }

  async signInWithSms(idToken: string, deviceToken: string): Promise<Omit<DriverEntity, 'password'> & JwtSign> {
    try {
      const { phone_number } = await this.firebaseService.verifyIdToken(idToken);
      const phone = phone_number.replace('+84', '0');

      let driver = await this.driversService.findOne({ where: { phoneNumber: phone } });

      if (!driver) {
        driver = new DriverEntity();
        driver.phoneNumber = phone;
        driver = await this.driversService.save(driver);
      }

      if (driver.status !== EDriverStatus.Active) throw new UnauthorizedException(EXCEPTIONS.ACCOUNT_NOT_ACTIVE);

      const payload: JwtPayload = { id: driver.id, deviceToken };
      const accessToken = this.jwtService.sign(payload, { expiresIn: JWT_EXPIRATION });
      const { token: refreshToken } = await this.refreshTokensService.createRefreshToken(driver.id, deviceToken);

      driver.lastLogin = new Date();
      driver.deviceToken = deviceToken;
      await this.driversService.save(driver);

      return { ...driver, accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async refreshToken(refreshToken: string, req: Request): Promise<JwtSign> {
    try {
      const accessToken = req.headers['authorization']?.split(' ')[1];
      const { id } = this.jwtService.verify(accessToken, { ignoreExpiration: true });

      const { deviceToken } = await this.refreshTokensService.findValidToken(refreshToken, id);
      const driver = await this.driversService.findOne({ where: { id } });
      if (!driver) throw new UnauthorizedException();

      const newPayload: JwtPayload = { id: driver.id, deviceToken };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: JWT_EXPIRATION });

      await this.refreshTokensService.revokeToken(driver.id, refreshToken);
      const { token } = await this.refreshTokensService.createRefreshToken(driver.id, deviceToken);

      return { accessToken: newAccessToken, refreshToken: token };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async logout(driverId: number) {
    await this.refreshTokensService.revokeAllTokens(driverId);
  }
}
