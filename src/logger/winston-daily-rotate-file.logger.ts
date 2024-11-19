import * as winston from 'winston';
import transport from '../config/logger.config';

transport.on('error', (error) => {
  // log or handle errors here
  console.error('Error occurred in winston-daily-rotate-file', error);
});

const logger = winston.createLogger({
  transports: [transport],
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
});

export default logger;
