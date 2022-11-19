import { NextFunction, Request, Response } from 'express';
import ILoginBody from '../interfaces/requests/ILoginBody';

export default (req: Request<unknown, unknown, ILoginBody>, res: Response, next: NextFunction) => {
  const info = req.body;
  if (!info.email || !info.password) {
    return res.status(400).json({
      message: 'All fields must be filled',
    });
  }

  next();
};
