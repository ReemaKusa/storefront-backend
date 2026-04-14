import dotenv from 'dotenv';

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const config = {
  env: process.env.ENV || 'dev',
  port: parseInt(process.env.PORT || '3000', 10),
  postgresHost: required('POSTGRES_HOST'),
  postgresPort: parseInt(required('POSTGRES_PORT'), 10),
  postgresDb: required('POSTGRES_DB'),
  postgresTestDb: required('POSTGRES_TEST_DB'),
  postgresUser: required('POSTGRES_USER'),
  postgresPassword: required('POSTGRES_PASSWORD'),
  bcryptPepper: required('BCRYPT_PASSWORD'),
  saltRounds: parseInt(required('SALT_ROUNDS'), 10),
  tokenSecret: required('TOKEN_SECRET')
};
