import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminsModule } from '../admins/admins.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { OperationsModule } from '../operations/operations.module';

@Module({
  imports: [AdminsModule, RefreshTokensModule, OperationsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
