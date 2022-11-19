import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import IUserReturn from '../interfaces/requests/IUserReturn';

dotenv.config();

const secret: jwt.Secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'minha-senha-adsfsd';

export default (payload: IUserReturn) => jwt.sign(payload, secret);
