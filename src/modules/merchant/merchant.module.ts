import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { MerchantsService } from './merchants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MerchantOtpEntity } from 'src/database/entities/merchant-otp.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([MerchantEntity, MerchantOtpEntity]),
    RefreshTokensModule,
    RouterModule.register([
      { path: 'merchant', module: AuthModule },
      { path: 'merchant', module: ProductsModule },
    ]),
    ProductsModule,
    StoresModule,
  ],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantModule {}
