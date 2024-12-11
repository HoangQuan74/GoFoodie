import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { MerchantsModule } from './merchants/merchants.module';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    AuthModule,
    RefreshTokensModule,
    MerchantsModule,
    RouterModule.register([
      { path: 'merchant', module: AuthModule },
      { path: 'merchant', module: ProductsModule },
    ]),
    ProductsModule,
  ],
})
export class MerchantModule {}
