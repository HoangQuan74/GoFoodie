import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverRefreshTokenEntity } from 'src/database/entities/driver-refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverRefreshTokenEntity])],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
