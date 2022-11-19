import Matches from '../../database/models/Matches';

export default interface IMatchesService {
  getAll(): Promise<Matches[]>,
  getSearched(info: object): Promise<Matches[]>,
  createMatch(info: object): Promise<Matches>,
  finishMatch(id: string): Promise<boolean>,
  updateMatch(info: SVGForeignObjectElement, id: string): Promise<boolean>,
}
