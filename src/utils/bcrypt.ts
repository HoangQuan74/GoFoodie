import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { SALT_ROUNDS } from 'src/common/constants';

const saltRounds = genSaltSync(SALT_ROUNDS);

export const hashPassword = (password: string): string => {
  return hashSync(password, saltRounds);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return compareSync(password, hash);
};
