import * as DailyRotateFile from 'winston-daily-rotate-file';

const loggerOption: DailyRotateFile.DailyRotateFileTransportOptions = {
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '10000',
};

export default new DailyRotateFile(loggerOption);
