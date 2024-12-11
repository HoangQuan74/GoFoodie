import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MerchantsModule } from '../merchants/merchants.module';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { StoresModule } from 'src/modules/admin/stores/stores.module';

@Module({
  imports: [
    FirebaseModule,
    RefreshTokensModule,
    MerchantsModule,
    StoresModule,
    // JwtModule.register({
    //   global: true,
    //   secret: JWT_SECRET,
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
