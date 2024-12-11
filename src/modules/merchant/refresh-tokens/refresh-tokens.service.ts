import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MerchantRefreshTokenEntity } from 'src/database/entities/merchant-refresh-token.entity';
import { generateRandomString } from 'src/utils/bcrypt';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(MerchantRefreshTokenEntity)
    private readonly adminRefreshTokenRepository: Repository<MerchantRefreshTokenEntity>,
  ) {}

  async createRefreshToken(userId: number, deviceToken: string): Promise<MerchantRefreshTokenEntity> {
    const refreshToken = new MerchantRefreshTokenEntity();
    refreshToken.merchantId = userId;
    refreshToken.deviceToken = deviceToken;
    refreshToken.token = generateRandomString(40);
    refreshToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return this.adminRefreshTokenRepository.save(refreshToken);
  }

  async revokeAllTokens(userId: number) {
    await this.adminRefreshTokenRepository.update({ merchantId: userId }, { isRevoked: true });
  }

  async revokeToken(userId: number, token: string) {
    await this.adminRefreshTokenRepository.update({ merchantId: userId, token }, { isRevoked: true });
  }

  removeExpiredTokens() {
    this.adminRefreshTokenRepository.delete({ expiresAt: LessThan(new Date()) });
  }

  findValidToken(token: string, merchantId: number): Promise<MerchantRefreshTokenEntity> {
    return this.adminRefreshTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()), isRevoked: false, merchantId },
    });
  }
}
