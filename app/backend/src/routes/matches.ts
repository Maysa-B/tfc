import * as express from 'express';
import verifyToken from '../middlewares/verifyToken';
import MatchesController from '../controllers/matches';
import matcheInsertMiddleware from '../middlewares/matcheInsertMiddleware';

const MatchesRouter = express.Router();

const controller = new MatchesController();

MatchesRouter.get('/', controller.getAll);
MatchesRouter.post('/', verifyToken, matcheInsertMiddleware, controller.createMatch);
MatchesRouter.patch('/:id/finish', controller.finishMatch);
MatchesRouter.patch('/:id', controller.updateMatch);

export default MatchesRouter;
