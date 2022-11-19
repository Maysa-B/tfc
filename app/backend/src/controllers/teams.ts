import { Request, Response } from 'express';
import TeamsService from '../services/teams';
import ITeamService from '../interfaces/classes/ITeamsService';

export default class TeamController {
  constructor(
    private _service: ITeamService = new TeamsService(),
  ) { }

  public getAll = async (req: Request, res: Response) => {
    const teams = await this._service.getAll();
    res.status(200).json(teams);
  };

  public getById = async (req: Request, res: Response) => {
    const team = await this._service.getById(req.params.id);
    res.status(200).json(team);
  };
}
