import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantEntity } from 'src/database/entities/merchant.entity';
import { MerchantOtpEntity } from 'src/database/entities/merchant-otp.entity';
import { OptionGroupsModule } from './option-groups/option-groups.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { BannersModule } from './banners/banners.module';
import { StoreAddressesModule } from './store-addresses/store-addresses.module';
import { OrdersModule } from './order/order.module';
import { CancelOrderReasonsModule } from './cancel-order-reasons/cancel-order-reasons.module';
import { PreparationTimesModule } from './preparation-times/preparation-times.module';
import { PrintSettingsModule } from './print_settings/print_settings.module';
import { FlashSalesModule } from './flash-sales/flash-sales.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { StatisticalModule } from './statistical/statistical.module';
import { PaymentModule } from './payment/payment.module';
import { BanksModule } from './banks/banks.module';
import { CoinsModule } from './coins/coins.module';
import { FeeModule } from './fee/fee.module';

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
      { path: 'merchant', module: OrdersModule },
      { path: 'merchant', module: CancelOrderReasonsModule },
      { path: 'merchant', module: VouchersModule },
      { path: 'merchant', module: StatisticalModule },
      { path: 'merchant', module: FlashSalesModule },
      { path: 'merchant', module: PaymentModule },
      { path: 'merchant', module: BanksModule },
      { path: 'merchant', module: CoinsModule },
      { path: 'merchant', module: FeeModule },
    ]),
    ProductsModule,
    StoresModule,
    OptionGroupsModule,
    ProductCategoriesModule,
    BannersModule,
    StoreAddressesModule,
    OrdersModule,
    CancelOrderReasonsModule,
    PreparationTimesModule,
    PrintSettingsModule,
    FlashSalesModule,
    VouchersModule,
    StatisticalModule,
    PaymentModule,
    BanksModule,
    CoinsModule,
    FeeModule,
  ],
  providers: [],
  exports: [],
})
export class MerchantModule {}
