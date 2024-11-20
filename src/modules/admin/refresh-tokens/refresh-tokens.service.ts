import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminRefreshTokenEntity } from 'src/database/entities/admin-refresh-token.entity';
import { generateRandomString } from 'src/utils/bcrypt';
import { LessThan, MoreThan, Repository } from 'typeorm';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(AdminRefreshTokenEntity)
    private readonly adminRefreshTokenRepository: Repository<AdminRefreshTokenEntity>,
  ) {}

  async createRefreshToken(userId: number): Promise<AdminRefreshTokenEntity> {
    const refreshToken = new AdminRefreshTokenEntity();
    refreshToken.adminId = userId;
    refreshToken.token = generateRandomString(40);
    refreshToken.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return this.adminRefreshTokenRepository.save(refreshToken);
  }

  revokeAllTokens(userId: number) {
    this.adminRefreshTokenRepository.update({ adminId: userId }, { isRevoked: true });
  }

  revokeToken(userId: number, token: string) {
    this.adminRefreshTokenRepository.update({ adminId: userId, token }, { isRevoked: true });
  }

  removeExpiredTokens() {
    this.adminRefreshTokenRepository.delete({ expiresAt: LessThan(new Date()) });
  }

  findValidToken(token: string) {
    return this.adminRefreshTokenRepository.findOne({
      where: { token, expiresAt: MoreThan(new Date()), isRevoked: false },
    });
  }
}
