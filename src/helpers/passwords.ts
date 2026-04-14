import bcrypt from 'bcrypt';
import { config } from '../config';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(`${password}${config.bcryptPepper}`, config.saltRounds);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(`${password}${config.bcryptPepper}`, hash);
};
