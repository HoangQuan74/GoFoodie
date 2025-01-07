import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { StoresModule } from 'src/modules/admin/stores/stores.module';
import { MerchantModule } from '../merchant.module';

@Module({
  imports: [FirebaseModule, RefreshTokensModule, forwardRef(() => MerchantModule), StoresModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
