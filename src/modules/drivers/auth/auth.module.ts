import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DriversModule } from '../drivers.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { FirebaseModule } from '../../firebase/firebase.module';
import { UniformsModule } from '../uniforms/uniforms.module';

@Module({
  imports: [forwardRef(() => DriversModule), RefreshTokensModule, FirebaseModule, UniformsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
