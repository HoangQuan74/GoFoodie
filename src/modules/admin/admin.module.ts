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
        path: 'admin/stores/:storeId',
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
