import { NextFunction, Request, Response } from 'express';
import decodeToken from '../jwt-utils/decodeToken';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) return res.status(400).json({ message: 'Token not found' });

  const decoded = decodeToken(token);
  if (!decoded) return res.status(401).json({ message: 'Token must be a valid token' });
  req.body.decoded = decoded;
  next();
};
