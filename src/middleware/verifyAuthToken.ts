import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, config.tokenSecret);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access denied, invalid token' });
  }
};
