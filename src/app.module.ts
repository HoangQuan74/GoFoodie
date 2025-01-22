import { AppLoggerMiddleware } from './logger/app-middleware.logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/orm-config';
import { AdminModule } from './modules/admin/admin.module';
import { MailModule } from './modules/mail/mail.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { WardsModule } from './modules/wards/wards.module';
import { ServiceTypesModule } from './modules/service-types/service-types.module';
import { ServiceGroupsModule } from './modules/service-groups/service-groups.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BanksModule } from './modules/banks/banks.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ProductOptionGroupsModule } from './modules/product-option-groups/product-option-groups.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { UniformSizesModule } from './modules/uniform-sizes/uniform-sizes.module';
import { ClientModule } from './modules/client/client.module';
import { MapboxModule } from './modules/mapbox/mapbox.module';
import { MailHistoriesModule } from './modules/mail-histories/mail-histories.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './common/constants';
import { EventsModule } from './events/events.module';
import { FcmModule } from './modules/fcm/fcm.module';
import { FcmHistoriesModule } from './modules/fcm-histories/fcm-histories.module';
import { FeeModule } from './modules/fee/fee.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      serveRoot: '/public',
      rootPath: join(__dirname, '..', 'public'),
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
    }),
    AdminModule,
    MailModule,
    ProvincesModule,
    DistrictsModule,
    WardsModule,
    ServiceTypesModule,
    ServiceGroupsModule,
    UploadsModule,
    BanksModule,
    TasksModule,
    ProductOptionGroupsModule,
    RelationshipsModule,
    MerchantModule,
    FirebaseModule,
    DriversModule,
    ConfigsModule,
    UniformSizesModule,
    ClientModule,
    MapboxModule,
    MailHistoriesModule,
    EventsModule,
    FcmModule,
    FcmHistoriesModule,
    FeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
