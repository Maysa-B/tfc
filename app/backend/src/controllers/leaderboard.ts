import { Request, Response } from 'express';
import ILeaderboardService from '../interfaces/classes/ILeaderboardSerice';
import LeaderboardService from '../services/leaderboard';

export default class LeaderboardController {
  constructor(
    private _service: ILeaderboardService = new LeaderboardService(),
  ) { }

  leaderBoardHome = async (req: Request, res: Response) => {
    const result = await this._service.leaderBoardHome();
    res.status(200).json(result);
  };

  leaderBoardAway = async (req: Request, res: Response) => {
    const result = await this._service.leaderBoardAway();
    res.status(200).json(result);
  };

  leaderBoard = async (req: Request, res: Response) => {
    const result = await this._service.leaderBoard();
    res.status(200).json(result);
  };
}
