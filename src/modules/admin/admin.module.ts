import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AuthGuard } from './auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AuthModule,
      },
    ]),
    AdminsModule,
    RefreshTokensModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminRolesGuard,
    },
  ],
})
export class AdminModule {}
