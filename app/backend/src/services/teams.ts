import ITeamService from '../interfaces/classes/ITeamsService';
import TeamModel from '../database/models/Teams';
import ITeams from '../interfaces/requests/ITeams';

export default class TeamsService implements ITeamService {
  private _model = TeamModel;

  public getAll = async (): Promise<ITeams[]> => {
    const teams = await this._model.findAll();
    return teams;
  };

  public getById = async (id: string): Promise<ITeams | null> => {
    const team = await this._model.findOne({
      where: { id },
    });
    return team;
  };
}
