import IMatchesService from '../interfaces/classes/IMatchesService';
import Matches from '../database/models/Matches';
import Teams from '../database/models/Teams';

export default class MatchesService implements IMatchesService {
  private _model = Matches;

  public getAll = async (): Promise<Matches[]> => {
    const matches = await this._model.findAll({
      include: [
        { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  };

  public getSearched = async (info: object): Promise<Matches[]> => {
    const matches = await this._model.findAll({
      where: info,
      include: [
        { model: Teams, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: Teams, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  };

  public createMatch = async (info: object): Promise<Matches> => {
    const insert = await this._model.create({ ...info, inProgress: true });
    return insert;
  };

  public finishMatch = async (id: string): Promise<boolean> => {
    await this._model.update(
      { inProgress: false },
      { where: { id } },
    );
    return true;
  };

  public updateMatch = async (info: object, id: string): Promise<boolean> => {
    await this._model.update(
      { ...info },
      { where: { id } },
    );
    return true;
  };
}
