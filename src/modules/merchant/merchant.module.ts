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
import { OptionGroupsModule } from './option-groups/option-groups.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { BannersModule } from './banners/banners.module';
import { StoreAddressesModule } from './store-addresses/store-addresses.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([MerchantEntity, MerchantOtpEntity]),
    RefreshTokensModule,
    RouterModule.register([
      { path: 'merchant', module: AuthModule },
      { path: 'merchant', module: ProductsModule },
      { path: 'merchant', module: StoresModule },
      { path: 'merchant', module: OptionGroupsModule },
      { path: 'merchant', module: ProductCategoriesModule },
      { path: 'merchant', module: BannersModule },
      { path: 'merchant', module: StoreAddressesModule },
    ]),
    ProductsModule,
    StoresModule,
    OptionGroupsModule,
    ProductCategoriesModule,
    BannersModule,
    StoreAddressesModule,
  ],
  providers: [MerchantsService],
  exports: [MerchantsService],
})
export class MerchantModule {}
