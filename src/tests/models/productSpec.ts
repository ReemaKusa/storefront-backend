import { ProductStore } from '../../models/product';
import { resetDatabase } from '../helpers/database';

const store = new ProductStore();

describe('Product Model', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('should create a product', async () => {
    const result = await store.create({ name: 'Laptop Sleeve', price: 19.99, category: 'Accessories' });
    expect(result).toEqual({ id: 1, name: 'Laptop Sleeve', price: '19.99', category: 'Accessories' });
  });

  it('should return all products', async () => {
    const result = await store.index();
    expect(result.length).toBe(1);
  });

  it('should show one product', async () => {
    const result = await store.show(1);
    expect(result).toEqual({ id: 1, name: 'Laptop Sleeve', price: '19.99', category: 'Accessories' });
  });
});
