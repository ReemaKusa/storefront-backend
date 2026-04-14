import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, UserStore } from '../models/user';
import { verifyAuthToken } from '../middleware/verifyAuthToken';
import { DashboardQueries } from '../models/dashboard';

const store = new UserStore();
const dashboard = new DashboardQueries();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = await store.show(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const recentPurchases = await dashboard.fiveMostRecentPurchasesByUser(id);
    res.json({ ...user, recent_purchases: recentPurchases });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password
    };

    const createdUser = await store.create(user);
    const token = jwt.sign({ user: createdUser }, config.tokenSecret);
    res.status(201).json({ user: createdUser, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.authenticate(req.body.first_name, req.body.password);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ user }, config.tokenSecret);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
};

export default userRoutes;
