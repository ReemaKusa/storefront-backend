import pool from '../database';
import { comparePassword, hashPassword } from '../helpers/passwords';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password?: string;
};

export type UserRecord = {
  id: number;
  first_name: string;
  last_name: string;
  password_digest: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, first_name, last_name FROM users ORDER BY id';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<User | null> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id = $1';
      const result = await conn.query(sql, [id]);
      return result.rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async create(user: User): Promise<User> {
    if (!user.password) {
      throw new Error('Password is required');
    }

    const conn = await pool.connect();
    try {
      const sql = `
        INSERT INTO users (first_name, last_name, password_digest)
        VALUES ($1, $2, $3)
        RETURNING id, first_name, last_name
      `;
      const hash = hashPassword(user.password);
      const result = await conn.query(sql, [user.first_name, user.last_name, hash]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async authenticate(first_name: string, password: string): Promise<User | null> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT * FROM users WHERE first_name = $1';
      const result = await conn.query(sql, [first_name]);
      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0] as UserRecord;
      const isValid = comparePassword(password, user.password_digest);
      if (!isValid) {
        return null;
      }

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name
      };
    } finally {
      conn.release();
    }
  }
}
