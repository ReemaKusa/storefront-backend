import pool from '../../database';
import { DashboardQueries } from '../../models/dashboard';
import { OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';
import { resetDatabase } from '../helpers/database';

const dashboard = new DashboardQueries();
const orders = new OrderStore();
const users = new UserStore();
const products = new ProductStore();

describe('Dashboard Queries', () => {
  beforeAll(async () => {
    await resetDatabase();
    await users.create({ first_name: 'Lina', last_name: 'Odeh', password: 'secret123' });
    await products.create({ name: 'Mouse', price: 15.5, category: 'Electronics' });
    await products.create({ name: 'Monitor', price: 199.99, category: 'Electronics' });

    const completedOrder = await orders.create({ user_id: 1, status: 'complete' });
    const activeOrder = await orders.create({ user_id: 1, status: 'active' });

    const conn = await pool.connect();
    try {
      await conn.query(
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [completedOrder.id, 1, 4]
      );
      await conn.query(
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [completedOrder.id, 2, 2]
      );
      await conn.query(
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [activeOrder.id, 2, 1]
      );
    } finally {
      conn.release();
    }
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it('should return popular products', async () => {
    const result = await dashboard.popularProducts();
    expect(result.length).toBe(2);
    expect(result[0].product_name).toBe('Mouse');
  });

  it('should return recent purchases only for completed orders', async () => {
    const result = await dashboard.fiveMostRecentPurchasesByUser(1);
    expect(result.length).toBe(2);
    expect(result[0].order_id).toBe(1);
  });
});
