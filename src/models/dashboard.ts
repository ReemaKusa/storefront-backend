import pool from '../database';

export type RecentPurchase = {
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  ordered_at: string;
};

export type PopularProduct = {
  product_id: number;
  product_name: string;
  total_quantity: number;
};

export class DashboardQueries {
  async fiveMostRecentPurchasesByUser(userId: number): Promise<RecentPurchase[]> {
    const conn = await pool.connect();
    try {
      const sql = `
        SELECT
          o.id AS order_id,
          p.id AS product_id,
          p.name AS product_name,
          op.quantity,
          o.created_at AS ordered_at
        FROM orders o
        JOIN order_products op ON op.order_id = o.id
        JOIN products p ON p.id = op.product_id
        WHERE o.user_id = $1 AND o.status = 'complete'
        ORDER BY o.created_at DESC, o.id DESC
        LIMIT 5
      `;
      const result = await conn.query(sql, [userId]);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async popularProducts(limit = 5): Promise<PopularProduct[]> {
    const conn = await pool.connect();
    try {
      const sql = `
        SELECT
          p.id AS product_id,
          p.name AS product_name,
          SUM(op.quantity) AS total_quantity
        FROM order_products op
        JOIN products p ON p.id = op.product_id
        GROUP BY p.id, p.name
        ORDER BY total_quantity DESC, p.id ASC
        LIMIT $1
      `;
      const result = await conn.query(sql, [limit]);
      return result.rows;
    } finally {
      conn.release();
    }
  }
}
