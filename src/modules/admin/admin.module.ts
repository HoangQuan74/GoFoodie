import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AuthGuard } from './auth/auth.guard';
import { MerchantsModule } from './merchants/merchants.module';
import { StoresModule } from './stores/stores.module';
import { StaffsModule } from './staffs/staffs.module';
import { ServiceGroupsModule } from './service-groups/service-groups.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { OptionGroupsModule } from './option-groups/option-groups.module';
import { DriversModule } from './drivers/drivers.module';
import { OperationsModule } from './operations/operations.module';
import { RolesModule } from './roles/roles.module';
import { RequestsModule } from './requests/requests.module';
import { UniformsModule } from './uniforms/uniforms.module';
import { BannersModule } from './banners/banners.module';
import { OptionsModule } from './options/options.module';
import { OnlineTrainingsModule } from './online-trainings/online-trainings.module';
import { NoticesModule } from './notices/notices.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { FeesModule } from './fees/fees.module';
import { CancelOrderReasonsModule } from './cancel-order-reasons/cancel-order-reasons.module';
import { OrderCriteriaModule } from './order-criteria/order-criteria.module';
import { FlashSalesModule } from './flash-sales/flash-sales.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ReviewTemplatesModule } from './review-templates/review-templates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DriverTitleConfigsModule } from './title-configs/title-configs.module';
import { ConfigTimesModule } from './config-times/config-times.module';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminsModule,
      },
      {
        path: 'admin',
        module: AuthModule,
      },
      {
        path: 'admin',
        module: MerchantsModule,
      },
      {
        path: 'admin',
        module: StoresModule,
      },
      {
        path: 'admin/stores/:storeId',
        module: StaffsModule,
      },
      {
        path: 'admin',
        module: ServiceGroupsModule,
      },
      {
        path: 'admin',
        module: ProductsModule,
      },
      {
        path: 'admin',
        module: ProductCategoriesModule,
      },
      {
        path: 'admin',
        module: OptionGroupsModule,
      },
      {
        path: 'admin',
        module: DriversModule,
      },
      {
        path: 'admin',
        module: RequestsModule,
      },
      {
        path: 'admin',
        module: UniformsModule,
      },
      {
        path: 'admin',
        module: BannersModule,
      },
      {
        path: 'admin',
        module: OptionsModule,
      },
      {
        path: 'admin',
        module: OnlineTrainingsModule,
      },
      {
        path: 'admin',
        module: NoticesModule,
      },
      {
        path: 'admin',
        module: ServiceTypesModule,
      },
      {
        path: 'admin',
        module: VouchersModule,
      },
      {
        path: 'admin',
        module: FeesModule,
      },
      {
        path: 'admin',
        module: CancelOrderReasonsModule,
      },
      {
        path: 'admin',
        module: OrderCriteriaModule,
      },
      {
        path: 'admin',
        module: FlashSalesModule,
      },
      {
        path: 'admin',
        module: ChallengesModule,
      },
      {
        path: 'admin',
        module: OperationsModule,
      },
      {
        path: 'admin',
        module: ReviewTemplatesModule,
      },
      {
        path: 'admin',
        module: NotificationsModule,
      },
      {
        path: 'admin',
        module: DriverTitleConfigsModule,
      },
      {
        path: 'admin',
        module: ConfigTimesModule,
      },
    ]),
    AdminsModule,
    MerchantsModule,
    StoresModule,
    StaffsModule,
    ServiceGroupsModule,
    ProductsModule,
    ProductCategoriesModule,
    OptionGroupsModule,
    DriversModule,
    OperationsModule,
    RolesModule,
    RequestsModule,
    UniformsModule,
    BannersModule,
    OptionsModule,
    OnlineTrainingsModule,
    NoticesModule,
    ServiceTypesModule,
    VouchersModule,
    FeesModule,
    CancelOrderReasonsModule,
    OrderCriteriaModule,
    FlashSalesModule,
    ChallengesModule,
    ReviewTemplatesModule,
    NotificationsModule,
    DriverTitleConfigsModule,
    ConfigTimesModule,
  ],
  providers: [
    {
      provide: 'ADMIN_GUARD',
      useClass: AuthGuard,
    },
    // {
    //   provide: 'ADMIN_ROLES_GUARD',
    //   useClass: AdminRolesGuard,
    // },
  ],
})
export class AdminModule {}
