import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from 'src/modules/firebase/firebase.module';
import { ClientModule } from '../client.module';

@Module({
  imports: [FirebaseModule, forwardRef(() => ClientModule)],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
