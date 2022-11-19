import * as express from 'express';
import TeamController from '../controllers/teams';

const TeamsRouter = express.Router();

const controller = new TeamController();

TeamsRouter.get('/', controller.getAll);
TeamsRouter.get('/:id', controller.getById);

export default TeamsRouter;
