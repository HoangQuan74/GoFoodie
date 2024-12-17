import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DriversModule } from '../drivers.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { FirebaseModule } from '../../firebase/firebase.module';

@Module({
  imports: [forwardRef(() => DriversModule), RefreshTokensModule, FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
