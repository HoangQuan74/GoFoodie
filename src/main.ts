import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { TransformInterceptor } from './common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './logger/app.logger';
import * as cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors.config';
import { DriversModule } from './modules/drivers/drivers.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { BanksModule } from './modules/banks/banks.module';
import { ConfigsModule } from './modules/configs/configs.module';
import { RelationshipsModule } from './modules/relationships/relationships.module';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { WardsModule } from './modules/wards/wards.module';
import { ServiceTypesModule } from './modules/service-types/service-types.module';
import { ServiceGroupsModule } from './modules/service-groups/service-groups.module';
import { AdminModule } from './modules/admin/admin.module';
import { UniformSizesModule } from './modules/uniform-sizes/uniform-sizes.module';
import { ClientModule } from './modules/client/client.module';
import { MapboxModule } from './modules/mapbox/mapbox.module';
import { FeeModule } from './modules/fee/fee.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { PaymentModule } from './modules/payment/payment.module';

const { NODE_ENV = 'development', PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.enableCors(corsConfig);

  // enable logger
  app.useLogger(new MyLogger());

  // validate input
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // catch exception
  app.useGlobalFilters(new AllExceptionsFilter());

  // transform data
  app.useGlobalInterceptors(new TransformInterceptor());

  app.use(cookieParser());

  // set global prefix
  app.setGlobalPrefix('/api/v1');

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer');

  // show swagger only development
  if (NODE_ENV === 'development') {
    const commonModules = [
      UploadsModule,
      BanksModule,
      ConfigsModule,
      RelationshipsModule,
      ProvincesModule,
      DistrictsModule,
      WardsModule,
      ServiceTypesModule,
      ServiceGroupsModule,
      UniformSizesModule,
      MapboxModule,
      FeeModule,
      PaymentModule,
    ];

    const document = SwaggerModule.createDocument(app, config.build(), {
      include: [AdminModule, ...commonModules],
      deepScanRoutes: true,
    });

    Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (Array.isArray(method.security) && method.security.includes('public')) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('api/document', app, document);

    // show swagger for merchant
    config.setTitle('API Merchant Documentation');
    const documentMerchant = SwaggerModule.createDocument(app, config.build(), {
      include: [MerchantModule, ...commonModules],
      deepScanRoutes: true,
    });

    Object.values((documentMerchant as OpenAPIObject).paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (Array.isArray(method.security) && method.security.includes('public')) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('api/merchant/document', app, documentMerchant);

    config.setTitle('API Driver Documentation');
    const documentDriver = SwaggerModule.createDocument(app, config.build(), {
      include: [DriversModule, ...commonModules],
      deepScanRoutes: true,
    });

    Object.values((documentDriver as OpenAPIObject).paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (Array.isArray(method.security) && method.security.includes('public')) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('api/driver/document', app, documentDriver);

    config.setTitle('API Client Documentation');
    const documentClient = SwaggerModule.createDocument(app, config.build(), {
      include: [ClientModule, ...commonModules],
      deepScanRoutes: true,
    });

    Object.values((documentClient as OpenAPIObject).paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (Array.isArray(method.security) && method.security.includes('public')) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('api/client/document', app, documentClient);
  }

  // start app
  await app.listen(PORT);
}
bootstrap();
