import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../middleware/verifyAuthToken';
import { Order, OrderStore } from '../models/order';

const store = new OrderStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(parseInt(req.params.id, 10));
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      user_id: req.body.user_id,
      status: req.body.status
    };
    const created = await store.create(order);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const currentOrderByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.currentOrderByUser(parseInt(req.params.userId, 10));
    if (!order) {
      res.status(404).json({ error: 'No active order found' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const completedOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await store.completedOrdersByUser(parseInt(req.params.userId, 10));
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const addProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const added = await store.addProduct(
      parseInt(req.params.id, 10),
      req.body.product_id,
      req.body.quantity
    );
    res.status(201).json(added);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', verifyAuthToken, index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.get('/users/:userId/orders/current', verifyAuthToken, currentOrderByUser);
  app.get('/users/:userId/orders/completed', verifyAuthToken, completedOrdersByUser);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
};

export default orderRoutes;
