import { DataSource, DataSourceOptions, LoggerOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENV } from 'src/common/constants';
import { join } from 'path';
dotenv.config();

const logging: LoggerOptions = ENV === 'development' ? 'all' : ['error', 'warn'];

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'mysql' | 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', 'database', 'entities', '*{.ts,.js}')],
  migrations: [join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}')],
  synchronize: false,
  maxQueryExecutionTime: 300,
  timezone: 'Z',
  logging,
  logger: 'file',
};

export default new DataSource(dataSourceOptions);
