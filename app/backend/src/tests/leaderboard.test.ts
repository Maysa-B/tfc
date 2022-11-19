import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';
import MatchesModel from '../database/models/Matches';
import TeamModel from '../database/models/Teams';
import teamsMock from './mock/teams.mock';
import matchesMock from './mock/matches.mock';
import leaderBoardMock from './mock/leaderboard.mock';
import leaderBoardHomeMock from './mock/leaderboardHome.mock';
import leaderBoardAwayMock from './mock/leaderboardAway.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Endpoint /leaderboard tests', () => {
  let chaiHttpResponse: Response;

  beforeEach(() => {
    sinon.stub(TeamModel, 'findAll').resolves(teamsMock as TeamModel[]);
    sinon.stub(MatchesModel, 'findAll').resolves(matchesMock as MatchesModel[]);
  })

  afterEach(() => sinon.restore());

  it('Verify if we receive the correct answer when GET /leaderboard', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderBoardMock);
  });

  it('Verify if we receive the correct answer when GET /leaderboard/home', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard/home');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderBoardHomeMock);
  });

  it('Verify if we receive the correct answer when GET /leaderboard/away', async () => {
    chaiHttpResponse = await chai.request(app)
      .get('/leaderboard/away');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.deep.equal(leaderBoardAwayMock);
  });
});
