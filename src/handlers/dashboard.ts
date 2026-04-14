import express, { Request, Response } from 'express';
import { verifyAuthToken } from '../middleware/verifyAuthToken';
import { DashboardQueries } from '../models/dashboard';

const dashboard = new DashboardQueries();

const popularProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await dashboard.popularProducts(5);
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

const dashboardRoutes = (app: express.Application): void => {
  app.get('/products/popular', verifyAuthToken, popularProducts);
};

export default dashboardRoutes;
