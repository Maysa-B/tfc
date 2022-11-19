import ILeaderboard from '../requests/ILeaderboard';

export default interface ILeaderboardService {
  leaderBoardHome(): Promise<ILeaderboard[]>,
  leaderBoardAway(): Promise<ILeaderboard[]>,
  leaderBoard(): Promise<ILeaderboard[]>,
}
