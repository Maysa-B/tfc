import { Request, Response } from 'express';
import ILoginService from '../interfaces/classes/ILoginService';
import LoginService from '../services/login';
import ILoginBody from '../interfaces/requests/ILoginBody';

export default class LoginController {
  constructor(
    private _service: ILoginService = new LoginService(),
  ) { }

  public findUser = async (req: Request<unknown, unknown, ILoginBody>, res: Response) => {
    const token = await this._service.findUser(req.body);

    if (token !== 'Not found') {
      return res.status(200).json({ token });
    }

    res.status(401).json({ message: 'Incorrect email or password' });
  };

  public findUserRole = (req: Request, res: Response) => {
    const { role } = req.body.decoded;
    res.status(200).json({ role });
  };
}
