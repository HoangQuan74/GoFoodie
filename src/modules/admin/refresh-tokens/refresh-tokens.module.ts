import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminRefreshTokenEntity } from 'src/database/entities/admin-refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminRefreshTokenEntity])],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
