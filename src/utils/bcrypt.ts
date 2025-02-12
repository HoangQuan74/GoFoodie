import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { ENCRYPTION_IV, ENCRYPTION_KEY, SALT_ROUNDS } from 'src/common/constants';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const saltRounds = genSaltSync(SALT_ROUNDS);
const ALGORITHM = 'aes-256-cbc';

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

export const encrypt = (text: string): string => {
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), ENCRYPTION_IV);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

export const decrypt = (text: string): string => {
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), ENCRYPTION_IV);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
