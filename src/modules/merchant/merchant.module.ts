import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { MerchantsModule } from './merchants/merchants.module';

@Module({
  imports: [AuthModule, MerchantsModule, RouterModule.register([{ path: 'merchant', module: AuthModule }])],
})
export class MerchantModule {}
