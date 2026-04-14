import { OrderStore } from '../../models/order';
import { ProductStore } from '../../models/product';
import { UserStore } from '../../models/user';
import { resetDatabase } from '../helpers/database';

const orderStore = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

describe('Order Model', () => {
  beforeAll(async () => {
    await resetDatabase();
    await userStore.create({ first_name: 'Ali', last_name: 'Mansour', password: 'pass123' });
    await productStore.create({ name: 'Keyboard', price: 55.0, category: 'Electronics' });
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should create an order', async () => {
    const result = await orderStore.create({ user_id: 1, status: 'active' });
    expect(result).toEqual({ id: 1, user_id: 1, status: 'active' });
  });

  it('should add a product to an order', async () => {
    const result = await orderStore.addProduct(1, 1, 3);
    expect(result).toEqual({ id: 1, order_id: 1, product_id: 1, quantity: 3 });
  });

  it('should return the current order by user', async () => {
    const result = await orderStore.currentOrderByUser(1);
    expect(result?.id).toBe(1);
  });

  it('should return completed orders by user', async () => {
    await orderStore.create({ user_id: 1, status: 'complete' });
    const result = await orderStore.completedOrdersByUser(1);
    expect(result.length).toBe(1);
    expect(result[0].status).toBe('complete');
  });
});
