import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    const { message: exceptionMessage } = exceptionResponse;

    const message = typeof exceptionMessage === 'string' ? exceptionMessage : (exceptionMessage[0] ?? null);
    console.log({ statusCode, message });
    response.status(statusCode).json({ statusCode, message, data: null });
  }
}
