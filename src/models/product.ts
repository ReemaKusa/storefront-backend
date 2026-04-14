import pool from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string | null;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, name, price, category FROM products ORDER BY id';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Product | null> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, name, price, category FROM products WHERE id = $1';
      const result = await conn.query(sql, [id]);
      return result.rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async create(product: Product): Promise<Product> {
    const conn = await pool.connect();
    try {
      const sql = `
        INSERT INTO products (name, price, category)
        VALUES ($1, $2, $3)
        RETURNING id, name, price, category
      `;
      const result = await conn.query(sql, [product.name, product.price, product.category || null]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }
}
