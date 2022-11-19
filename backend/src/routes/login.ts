import * as express from 'express';
import loginMiddleware from '../middlewares/loginMiddleware';
import LoginController from '../controllers/login';
import verifyToken from '../middlewares/verifyToken';

const LoginRouter = express.Router();

const controller = new LoginController();

LoginRouter.post('/', loginMiddleware, controller.findUser);
LoginRouter.get('/validate', verifyToken, controller.findUserRole);

export default LoginRouter;
