import { UserStore } from '../../models/user';
import { resetDatabase } from '../helpers/database';

const store = new UserStore();

describe('User Model', () => {
  beforeAll(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
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

  it('should create a user', async () => {
    const result = await store.create({
      first_name: 'Rama',
      last_name: 'Saleh',
      password: 'password123'
    });

    expect(result).toEqual({
      id: 1,
      first_name: 'Rama',
      last_name: 'Saleh'
    });
  });

  it('should return the list of users', async () => {
    const result = await store.index();
    expect(result.length).toBe(1);
    expect(result[0].first_name).toBe('Rama');
  });

  it('should show a single user', async () => {
    const result = await store.show(1);
    expect(result).toEqual({ id: 1, first_name: 'Rama', last_name: 'Saleh' });
  });

  it('should authenticate a valid user', async () => {
    const result = await store.authenticate('Rama', 'password123');
    expect(result?.id).toBe(1);
  });
});
