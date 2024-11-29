import { CookieOptions } from 'express';
import { ENV } from 'src/common/constants';

const isProduction = ENV === 'production';
export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: isProduction ? 'none' : 'none',
  maxAge: 1000 * 60 * 60 * 24 * 7,
};
