import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [AuthModule, RouterModule.register([{ path: 'merchant', module: AuthModule }])],
})
export class MerchantModule {}
