import ILeaderboardService from '../interfaces/classes/ILeaderboardSerice';
import ITeamService from '../interfaces/classes/ITeamsService';
import TeamsService from './teams';
import IMatchesService from '../interfaces/classes/IMatchesService';
import MatchesService from './matches';
import ILeaderboard from '../interfaces/requests/ILeaderboard';
import ITeams from '../interfaces/requests/ITeams';
import Matches from '../database/models/Matches';
import sortCustom from '../utils/sort';

export default class LeaderboardService implements ILeaderboardService {
  constructor(
    private _serviceTeam: ITeamService = new TeamsService(),
    private _serviceMatches: IMatchesService = new MatchesService(),
  ) { }

  private _getAll = async (): Promise<{ teams: ITeams[], matches: Matches[] }> => {
    const teams = await this._serviceTeam.getAll();
    const matches = await this._serviceMatches.getAll();
    return { teams, matches };
  };

  private _objectToResult: ILeaderboard = {
    name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '',
  };

  private _forEachComparatorHome = (team: ITeams, matches: Matches[]) => {
    const obj = { ...this._objectToResult };
    matches.forEach((match) => {
      if (match.homeTeam === team.id && !match.inProgress) {
        obj.name = team.teamName;
        obj.totalGames += 1;
        obj.goalsFavor += match.homeTeamGoals;
        obj.goalsOwn += match.awayTeamGoals;
        if (match.homeTeamGoals > match.awayTeamGoals) obj.totalVictories += 1;
        if (match.homeTeamGoals === match.awayTeamGoals) obj.totalDraws += 1;
        if (match.homeTeamGoals < match.awayTeamGoals) obj.totalLosses += 1;
        obj.goalsBalance = obj.goalsFavor - obj.goalsOwn;
        obj.totalPoints = (obj.totalVictories * 3) + obj.totalDraws;
        obj.efficiency = ((obj.totalPoints / (obj.totalGames * 3)) * 100).toFixed(2);
      }
    });
    return obj;
  };

  private _forEachComparatorAway = (team: ITeams, matches: Matches[]) => {
    const obj = { ...this._objectToResult };
    matches.forEach((match) => {
      if (match.awayTeam === team.id && !match.inProgress) {
        obj.name = team.teamName;
        obj.totalGames += 1;
        obj.goalsFavor += match.awayTeamGoals;
        obj.goalsOwn += match.homeTeamGoals;
        if (match.awayTeamGoals > match.homeTeamGoals) obj.totalVictories += 1;
        if (match.awayTeamGoals === match.homeTeamGoals) obj.totalDraws += 1;
        if (match.awayTeamGoals < match.homeTeamGoals) obj.totalLosses += 1;
        obj.goalsBalance = obj.goalsFavor - obj.goalsOwn;
        obj.totalPoints = (obj.totalVictories * 3) + obj.totalDraws;
        obj.efficiency = ((obj.totalPoints / (obj.totalGames * 3)) * 100).toFixed(2);
      }
    });
    return obj;
  };

  private _forEachComparator = (team: ITeams, matches: Matches[]) => {
    const obj = { ...this._objectToResult };
    matches.forEach((match) => {
      const curTeam = match.awayTeam === team.id ? 'awayTeam' : 'homeTeam';
      const oposite = match.awayTeam === team.id ? 'homeTeam' : 'awayTeam';
      if ((match.awayTeam === team.id || match.homeTeam === team.id) && !match.inProgress) {
        obj.name = team.teamName;
        obj.totalGames += 1;
        obj.goalsFavor += match[`${curTeam}Goals`];
        obj.goalsOwn += match[`${oposite}Goals`];
        if (match[`${curTeam}Goals`] > match[`${oposite}Goals`]) obj.totalVictories += 1;
        if (match[`${curTeam}Goals`] === match[`${oposite}Goals`]) obj.totalDraws += 1;
        if (match[`${curTeam}Goals`] < match[`${oposite}Goals`]) obj.totalLosses += 1;
        obj.goalsBalance = obj.goalsFavor - obj.goalsOwn;
        obj.totalPoints = (obj.totalVictories * 3) + obj.totalDraws;
        obj.efficiency = ((obj.totalPoints / (obj.totalGames * 3)) * 100).toFixed(2);
      }
    });
    return obj;
  };

  public leaderBoardHome = async () => {
    const values = await this._getAll();
    const result = values.teams.map((team) =>
      this._forEachComparatorHome(team, values.matches));

    return sortCustom(result);
  };

  public leaderBoardAway = async () => {
    const values = await this._getAll();
    const result = values.teams.map((team) =>
      this._forEachComparatorAway(team, values.matches));

    return sortCustom(result);
  };

  public leaderBoard = async () => {
    const values = await this._getAll();
    const result = values.teams.map((team) =>
      this._forEachComparator(team, values.matches));

    return sortCustom(result);
  };
}
