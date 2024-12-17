import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants';
import { randomBytes } from 'crypto';

const saltRounds = genSaltSync(SALT_ROUNDS);

export const hashPassword = (password: string): string => {
  return hashSync(password, saltRounds);
};

export const comparePassword = (password: string, hash: string): boolean => {
  if (!password || !hash) return false;
  return compareSync(password, hash);
};

export const generateRandomString = (length: number): string => {
  return randomBytes(length).toString('hex');
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
