import pool from '../database';
import { OrderStatus } from '../types/status';

export type Order = {
  id?: number;
  user_id: number;
  status: OrderStatus;
};

export type OrderProduct = {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, user_id, status FROM orders ORDER BY id';
      const result = await conn.query(sql);
      return result.rows;
    } finally {
      conn.release();
    }
  }

  async show(id: number): Promise<Order | null> {
    const conn = await pool.connect();
    try {
      const sql = 'SELECT id, user_id, status FROM orders WHERE id = $1';
      const result = await conn.query(sql, [id]);
      return result.rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async create(order: Order): Promise<Order> {
    const conn = await pool.connect();
    try {
      const sql = `
        INSERT INTO orders (user_id, status)
        VALUES ($1, $2)
        RETURNING id, user_id, status
      `;
      const result = await conn.query(sql, [order.user_id, order.status]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async addProduct(orderId: number, productId: number, quantity: number): Promise<OrderProduct> {
    const conn = await pool.connect();
    try {
      const orderCheck = await conn.query('SELECT status FROM orders WHERE id = $1', [orderId]);
      const order = orderCheck.rows[0] as { status: OrderStatus } | undefined;
      if (!order) {
        throw new Error(`Order ${orderId} not found`);
      }
      if (order.status !== 'active') {
        throw new Error('Cannot add products to a completed order');
      }

      const sql = `
        INSERT INTO order_products (order_id, product_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING id, order_id, product_id, quantity
      `;
      const result = await conn.query(sql, [orderId, productId, quantity]);
      return result.rows[0];
    } finally {
      conn.release();
    }
  }

  async currentOrderByUser(userId: number): Promise<Order | null> {
    const conn = await pool.connect();
    try {
      const sql = `
        SELECT id, user_id, status
        FROM orders
        WHERE user_id = $1 AND status = 'active'
        ORDER BY id DESC
        LIMIT 1
      `;
      const result = await conn.query(sql, [userId]);
      return result.rows[0] || null;
    } finally {
      conn.release();
    }
  }

  async completedOrdersByUser(userId: number): Promise<Order[]> {
    const conn = await pool.connect();
    try {
      const sql = `
        SELECT id, user_id, status
        FROM orders
        WHERE user_id = $1 AND status = 'complete'
        ORDER BY id DESC
      `;
      const result = await conn.query(sql, [userId]);
      return result.rows;
    } finally {
      conn.release();
    }
  }
}
