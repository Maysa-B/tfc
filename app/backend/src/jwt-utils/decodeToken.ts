import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import IUserReturn from '../interfaces/requests/IUserReturn';

dotenv.config();

const secret: jwt.Secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'minha-senha-adsfsd';

export default (token: string): IUserReturn | null => {
  try {
    return jwt.verify(token, secret) as IUserReturn;
  } catch (error) {
    return null;
  }
};
