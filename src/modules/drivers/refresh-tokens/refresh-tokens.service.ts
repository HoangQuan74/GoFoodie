import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRefreshTokenEntity } from 'src/database/entities/driver-refresh-token.entity';
import { generateRandomString } from 'src/utils/bcrypt';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(DriverRefreshTokenEntity)
    private readonly adminRefreshTokenRepository: Repository<DriverRefreshTokenEntity>,
  ) {}

  async createRefreshToken(userId: number, deviceToken: string): Promise<DriverRefreshTokenEntity> {
    await this.revokeAllTokens(userId);
    const refreshToken = new DriverRefreshTokenEntity();
    refreshToken.driverId = userId;
    refreshToken.deviceToken = deviceToken;
    refreshToken.token = generateRandomString(40);
    refreshToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return this.adminRefreshTokenRepository.save(refreshToken);
  }

  async revokeAllTokens(userId: number) {
    await this.adminRefreshTokenRepository.delete({ driverId: userId });
  }

  async revokeToken(userId: number, token: string) {
    await this.adminRefreshTokenRepository.update({ driverId: userId, token }, { isRevoked: true });
  }

  removeExpiredTokens() {
    this.adminRefreshTokenRepository.delete({ expiresAt: LessThan(new Date()) });
  }

  findValidToken(token: string, driverId: number): Promise<DriverRefreshTokenEntity> {
    return this.adminRefreshTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()), isRevoked: false, driverId },
    });
  }
}
