import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantRefreshTokenEntity } from 'src/database/entities/merchant-refresh-token.entity';
import { generateRandomString } from 'src/utils/bcrypt';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(MerchantRefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<MerchantRefreshTokenEntity>,
  ) {}

  async createRefreshToken(userId: number, deviceToken: string): Promise<MerchantRefreshTokenEntity> {
    await this.revokeAllTokens(userId);
    const refreshToken = new MerchantRefreshTokenEntity();
    refreshToken.merchantId = userId;
    refreshToken.deviceToken = deviceToken;
    refreshToken.token = generateRandomString(40);
    refreshToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return this.refreshTokenRepository.save(refreshToken);
  }

  async revokeAllTokens(userId: number) {
    await this.refreshTokenRepository.delete({ merchantId: userId });
  }

  async revokeToken(userId: number, token: string) {
    await this.refreshTokenRepository.update({ merchantId: userId, token }, { isRevoked: true });
  }

  removeExpiredTokens() {
    this.refreshTokenRepository.delete({ expiresAt: LessThan(new Date()) });
  }

  findValidToken(token: string, merchantId: number): Promise<MerchantRefreshTokenEntity> {
    return this.refreshTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()), isRevoked: false, merchantId },
    });
  }
}
