import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { ENCRYPTION_IV, ENCRYPTION_KEY, SALT_ROUNDS } from 'src/common/constants';
import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

const saltRounds = genSaltSync(SALT_ROUNDS);
const ALGORITHM = 'aes-256-cbc';
const key = scryptSync(ENCRYPTION_KEY, 'salt', 32);
const iv = Buffer.from(ENCRYPTION_IV);
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const hashPassword = (password: string): string => {
  return hashSync(password, saltRounds);
};

export const comparePassword = (password: string, hash: string): boolean => {
  if (!password || !hash) return false;
  return compareSync(password, hash);
};

export const generateRandomString = (length: number, uppercase = false): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }

  return uppercase ? result.toUpperCase() : result;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const encrypt = (text: string): string => {
  if (!text) return '';

  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

export const decrypt = (text: string): string => {
  if (!text) return '';

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const compareText = (str1: string, str2: string): boolean => {
  if (!str1 || !str2) return false;
  return normalizeText(str1) === normalizeText(str2);
};
