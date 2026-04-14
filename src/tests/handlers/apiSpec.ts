import supertest from 'supertest';
import app from '../../app';
import { resetDatabase } from '../helpers/database';

const request = supertest(app);

describe('Storefront API Endpoints', () => {
  let token = '';
  let userId = 0;
  let productId = 0;
  let orderId = 0;

  beforeAll(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it('GET / should return status message', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Storefront backend');
  });

  it('POST /users should create a user and return a token', async () => {
    const response = await request.post('/users').send({
      first_name: 'Nour',
      last_name: 'Haddad',
      password: 'password123'
    });

    expect(response.status).toBe(201);
    expect(response.body.user.first_name).toBe('Nour');
    expect(response.body.token).toBeDefined();
    token = response.body.token;
    userId = response.body.user.id;
  });

  it('POST /users/authenticate should return a token for valid credentials', async () => {
    const response = await request.post('/users/authenticate').send({
      first_name: 'Nour',
      password: 'password123'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('GET /users should require authentication', async () => {
    const response = await request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('POST /products should create a product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Desk Lamp', price: 34.5, category: 'Home' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Desk Lamp');
    productId = response.body.id;
  });

  it('GET /products should return products', async () => {
    const response = await request.get('/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('GET /products/:id should return one product', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
  });

  it('POST /orders should create an order', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userId, status: 'active' });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('active');
    orderId = response.body.id;
  });

  it('GET /orders should return orders', async () => {
    const response = await request.get('/orders').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('GET /orders/:id should return one order', async () => {
    const response = await request.get(`/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(orderId);
  });

  it('POST /orders/:id/products should add a product to the order', async () => {
    const response = await request
      .post(`/orders/${orderId}/products`)
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: productId, quantity: 2 });

    expect(response.status).toBe(201);
    expect(response.body.quantity).toBe(2);
  });

  it('GET /users/:userId/orders/current should return current user order', async () => {
    const response = await request
      .get(`/users/${userId}/orders/current`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('active');
  });

  it('GET /users/:id should return user with recent purchases', async () => {
    const response = await request.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(Array.isArray(response.body.recent_purchases)).toBeTrue();
  });

  it('GET /users/:userId/orders/completed should return completed orders', async () => {
    const createCompleted = await request
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ user_id: userId, status: 'complete' });

    expect(createCompleted.status).toBe(201);

    const response = await request
      .get(`/users/${userId}/orders/completed`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('GET /products/popular should return popular products', async () => {
    const response = await request
      .get('/products/popular')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTrue();
  });
});
