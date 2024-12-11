import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantRefreshTokenEntity } from 'src/database/entities/merchant-refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MerchantRefreshTokenEntity])],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
