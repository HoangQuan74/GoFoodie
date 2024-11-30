import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { AuthGuard } from './auth/auth.guard';
import { AdminRolesGuard } from 'src/common/guards';
import { MerchantsModule } from './merchants/merchants.module';
import { StoresModule } from './stores/stores.module';
import { StaffsModule } from './staffs/staffs.module';
import { ServiceGroupsModule } from './service-groups/service-groups.module';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
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
    ]),
    AdminsModule,
    MerchantsModule,
    StoresModule,
    StaffsModule,
    ServiceGroupsModule,
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
