import ILeaderboard from '../interfaces/requests/ILeaderboard';

export default (teams: ILeaderboard[]): ILeaderboard[] => (
  teams.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    if (a.goalsFavor !== b.goalsFavor) return b.goalsFavor - a.goalsFavor;
    return b.goalsOwn - a.goalsOwn;
  }));
