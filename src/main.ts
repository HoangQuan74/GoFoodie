import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { TransformInterceptor } from './common/interceptors';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './logger/app.logger';
import * as cookieParser from 'cookie-parser';
import { corsConfig } from './config/cors.config';
import { Request, Response } from 'express';

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
    .addSecurityRequirements('bearer')
    .build();

  // show swagger only development
  if (NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, config);

    Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
      Object.values(path).forEach((method: any) => {
        if (Array.isArray(method.security) && method.security.includes('public')) {
          method.security = [];
        }
      });
    });

    SwaggerModule.setup('api/document', app, document);
  }

  // start app
  await app.listen(PORT);
}
bootstrap();
