import * as bcrypt from 'bcryptjs';
import ILoginService from '../interfaces/classes/ILoginService';
import UserModel from '../database/models/User';
import ILoginBody from '../interfaces/requests/ILoginBody';
import generateToken from '../jwt-utils/generateToken';
import IUserReturn from '../interfaces/requests/IUserReturn';

export default class LoginService implements ILoginService {
  private _model = UserModel;

  public findUser = async (info: ILoginBody): Promise<string> => {
    const search = await this._model.findOne({
      where: { email: info.email },
    });

    if (!search) {
      return 'Not found';
    }

    const payload: IUserReturn = {
      id: search.id,
      username: search.username,
      ...info,
      role: search.role,
    };

    const isEqual = bcrypt.compareSync(info.password, search.password);
    if (isEqual) {
      const token = generateToken(payload);
      return token;
    }

    return 'Not found';
  };
}
