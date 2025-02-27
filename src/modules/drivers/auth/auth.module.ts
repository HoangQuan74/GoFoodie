import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DriversModule } from '../drivers/drivers.module';
import { RefreshTokensModule } from '../refresh-tokens/refresh-tokens.module';
import { FirebaseModule } from '../../firebase/firebase.module';
import { UniformsModule } from '../uniforms/uniforms.module';
import { NotificationsModule } from 'src/modules/admin/notifications/notifications.module';

@Module({
  imports: [forwardRef(() => DriversModule), RefreshTokensModule, FirebaseModule, UniformsModule, NotificationsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
