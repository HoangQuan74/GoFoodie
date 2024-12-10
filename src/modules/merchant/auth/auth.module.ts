import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/common/constants';
import { MerchantsModule } from '../merchants/merchants.module';
// import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';

@Module({
  imports: [
    // RefreshTokensModule,
    MerchantsModule,
    // JwtModule.register({
    //   global: true,
    //   secret: JWT_SECRET,
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
