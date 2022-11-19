import * as express from 'express';
import LeaderboardController from '../controllers/leaderboard';

const LeaderboardRouter = express.Router();

const controller = new LeaderboardController();

LeaderboardRouter.get('/home', controller.leaderBoardHome);
LeaderboardRouter.get('/away', controller.leaderBoardAway);
LeaderboardRouter.get('/', controller.leaderBoard);

export default LeaderboardRouter;
