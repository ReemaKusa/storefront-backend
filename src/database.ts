import { Pool } from 'pg';
import { config } from './config';

const pool = new Pool({
  host: config.postgresHost,
  port: config.postgresPort,
  database: config.env === 'test' ? config.postgresTestDb : config.postgresDb,
  user: config.postgresUser,
  password: config.postgresPassword
});

export default pool;
