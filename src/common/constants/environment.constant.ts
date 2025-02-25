import { EnvironmentType } from '../types/environment.type';
import * as dotenv from 'dotenv';
dotenv.config();

export const ENV: EnvironmentType = (process.env.NODE_ENV as EnvironmentType) || 'development';
export const PORT: number = parseInt(process.env.PORT || '3000', 10);
export const BASE_URL: string = process.env.BASE_URL || 'http://localhost:3000';
export const ADMIN_URL: string = process.env.ADMIN_URL || 'http://localhost:4200';

export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '15m';
export const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || '10', 10);
export const OTP_EXPIRATION: number = parseInt(process.env.OTP_EXPIRATION || '5', 10);

export const TIMEZONE: string = process.env.TIMEZONE || 'Asia/Ho_Chi_Minh';

export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBASE_CLIENT_EMAIL: string = process.env.FIREBASE_CLIENT_EMAIL || '';
export const FIREBASE_PRIVATE_KEY: string = process.env.FIREBASE_PRIVATE_KEY || '';

export const MAPBOX_URL: string = process.env.MAPBOX_URL || '';
export const MAPBOX_ACCESS_TOKEN: string = process.env.MAPBOX_ACCESS_TOKEN || '';

export const GOONG_API_KEY: string = process.env.GOONG_API_KEY || '';
export const GOONG_URL: string = process.env.GOONG_URL || '';

export const ENCRYPTION_KEY: string = process.env.ENCRYPTION_KEY || '';
export const ENCRYPTION_IV: string = process.env.ENCRYPTION_IV || '';

export const CRONJOB: boolean = process.env.CRONJOB === 'true';
export const ORM_LOGGING: boolean = process.env.ORM_LOGGING === 'true';

export const PAY_MERCHANT_KEY: string = process.env.PAY_MERCHANT_KEY || '';
export const PAY_SECRET_KEY: string = process.env.PAY_SECRET_KEY || '';
export const PAY_CHECKSUM_KEY: string = process.env.PAY_CHECKSUM_KEY || '';
export const PAY_API_URL: string = process.env.PAY_API_URL || '';
