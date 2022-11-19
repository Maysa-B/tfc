import { Request, Response } from 'express';
import MatchesService from '../services/matches';
import IMatchesService from '../interfaces/classes/IMatchesService';

export default class MatchesController {
  constructor(
    private _service: IMatchesService = new MatchesService(),
  ) { }

  getAll = async (req: Request, res: Response) => {
    let matches;

    if (!req.query) {
      matches = await this._service.getAll();
    } else {
      const { inProgress } = req.query;
      const query = { ...req.query };
      if (inProgress) query.inProgress = JSON.parse(inProgress as string);
      matches = await this._service.getSearched(query);
    }

    res.status(200).json(matches);
  };

  createMatch = async (req: Request, res: Response) => {
    const result = await this._service.createMatch(req.body);
    res.status(201).json(result);
  };

  finishMatch = async (req: Request, res: Response) => {
    const update = await this._service.finishMatch(req.params.id);
    if (update) res.status(200).json({ message: 'Finished' });
  };

  updateMatch = async (req: Request, res: Response) => {
    const update = await this._service.updateMatch(req.body, req.params.id);
    if (update) res.status(200).json({ ...req.body });
  };
}
