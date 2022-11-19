import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams';

export default async (req: Request, res: Response, next: NextFunction) => {
  const { homeTeam, awayTeam } = req.body;
  if (homeTeam === awayTeam) {
    return res.status(422).json({
      message: 'It is not possible to create a match with two equal teams',
    });
  }

  const teamService = new TeamsService();
  const teamOne = await teamService.getById(homeTeam);
  const teamTwo = await teamService.getById(awayTeam);

  if (!teamOne || !teamTwo) {
    return res.status(404).json({ message: 'There is no team with such id!' });
  }

  next();
};
