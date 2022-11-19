import ILoginBody from '../requests/ILoginBody';

export default interface ILoginService {
  findUser(info: ILoginBody): Promise<string>,
}
