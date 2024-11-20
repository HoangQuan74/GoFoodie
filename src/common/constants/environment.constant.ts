import { EnvironmentType } from '../types/environment.type';
import * as dotenv from 'dotenv';
dotenv.config();

export const ENV: EnvironmentType = (process.env.NODE_ENV as EnvironmentType) || 'development';
export const PORT: number = parseInt(process.env.PORT || '3000', 10);
export const JWT_SECRET: string = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRATION: string = process.env.JWT_EXPIRATION || '15m';
export const SALT_ROUNDS: number = parseInt(process.env.SALT_ROUNDS || '10', 10);

export const OTP_EXPIRATION: number = parseInt(process.env.OTP_EXPIRATION || '5', 10);
