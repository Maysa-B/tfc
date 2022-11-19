import ILoginBody from './ILoginBody';

export default interface IUserReturn extends ILoginBody {
  id: number,
  username: string,
  role: string,
}
