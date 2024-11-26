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

export const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY || '';
export const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN || '';
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID || '';
export const FIREBASE_STORAGE_BUCKET: string = process.env.FIREBASE_STORAGE_BUCKET || '';
export const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID || '';
export const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID || '';
export const FIREBASE_MEASUREMENT_ID: string = process.env.FIREBASE_MEASUREMENT_ID || '';
