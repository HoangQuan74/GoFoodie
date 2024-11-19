import { ConsoleLogger } from '@nestjs/common';
import logger from './winston-daily-rotate-file.logger';
import { ENV } from 'src/common/constants';

export class MyLogger extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    if (ENV !== 'production') {
      super.error(message, stack, context);
    }
    logger.error(message, { stack, context });
  }
}
