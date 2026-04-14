import bodyParser from 'body-parser';
import express from 'express';
import userRoutes from './handlers/users';
import productRoutes from './handlers/products';
import orderRoutes from './handlers/orders';
import dashboardRoutes from './handlers/dashboard';

const app = express();

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Storefront backend is running' });
});

userRoutes(app);
dashboardRoutes(app);
productRoutes(app);
orderRoutes(app);

export default app;
