import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from './winston-daily-rotate-file.logger';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url } = request;
    const xForwardedFor = (request.headers['x-forwarded-for'] || '') as string;
    const ip = xForwardedFor.split(',').pop().trim() || request.connection.remoteAddress;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const { id: userId } = request['user'] || {};

      const dataLog = { method, url, userId, ip, statusCode, userAgent };
      logger.info(dataLog);
    });

    next();
  }
}
