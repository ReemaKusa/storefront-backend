import pool from '../../database';

export const resetDatabase = async (): Promise<void> => {
  const conn = await pool.connect();
  try {
    await conn.query('DELETE FROM order_products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    await conn.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await conn.query("ALTER SEQUENCE products_id_seq RESTART WITH 1");
    await conn.query("ALTER SEQUENCE orders_id_seq RESTART WITH 1");
    await conn.query("ALTER SEQUENCE order_products_id_seq RESTART WITH 1");
  } finally {
    conn.release();
  }
};
