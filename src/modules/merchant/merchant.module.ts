import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [AuthModule, RouterModule.register([{ path: 'merchant', module: AuthModule }])],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class MerchantModule {}
