import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';
import MatchesModel from '../database/models/Matches';
import UserModel from '../database/models/User';
import TeamsModel from '../database/models/Teams';


chai.use(chaiHttp);

const { expect } = chai;

const team1 = {
  id: 1,
  teamName: 'team-mock-name',
}

const team2 = {
  id: 2,
  teamName: 'team-mock-name',
}

const modelUserMock = {
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
  email: 'user@user.com'
}

const bodyLogin = {
  password: 'secret_user',
  email: 'user@user.com'
}

describe('Endpoint /matches POST tests', () => {
  let chaiHttpResponse: Response;

  afterEach(() => { sinon.restore() });

  it('Verify if using the right token we can create a new game', async () => {
    const newGameCreated = {
      "id": 49,
      "homeTeam": 2,
      "awayTeam": 1,
      "homeTeamGoals": 0,
      "awayTeamGoals": 0,
      "inProgress": true
    }
    sinon
      .stub(MatchesModel, 'create')
      .resolves(newGameCreated as MatchesModel);
    sinon
      .stub(TeamsModel, 'findOne')
      .onFirstCall().resolves(team1 as TeamsModel)
      .onSecondCall().resolves(team2 as TeamsModel);
    sinon
      .stub(UserModel, 'findOne')
      .resolves(modelUserMock as UserModel);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send(bodyLogin);

    const { token } = chaiHttpResponse.body;

    chaiHttpResponse = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 2,
        "awayTeam": 1,
        "homeTeamGoals": 0,
        "awayTeamGoals": 0
      });

    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body).to.deep.equal(newGameCreated);
  });

  it('Verify return when we do not send a token', async () => {
    chaiHttpResponse = await chai.request(app)
      .post('/matches');

    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token not found' });
  });

  it('Verify return when we send an incorrect token', async () => {
    chaiHttpResponse = await chai.request(app)
      .post('/matches').set('Authorization', 'token');

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Token must be a valid token' });
  });

  it('Verify if we cannot create a game with both teams being the same', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(modelUserMock as UserModel);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send(bodyLogin);

    const { token } = chaiHttpResponse.body;

    chaiHttpResponse = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 1,
        "awayTeam": 1,
        "homeTeamGoals": 0,
        "awayTeamGoals": 0
      });

    expect(chaiHttpResponse).to.have.status(422);
    expect(chaiHttpResponse.body).to.be.deep.equal({
      message: 'It is not possible to create a match with two equal teams',
    });
  });

  it('Verify if we cannot create a game with teams that do not exists', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(modelUserMock as UserModel);

    sinon
      .stub(TeamsModel, 'findOne')
      .onFirstCall().resolves(team1 as TeamsModel)
      .onSecondCall().resolves(null);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send(bodyLogin);

    const { token } = chaiHttpResponse.body;

    chaiHttpResponse = await chai.request(app)
      .post('/matches')
      .set('Authorization', token)
      .send({
        "homeTeam": 2,
        "awayTeam": 1,
        "homeTeamGoals": 0,
        "awayTeamGoals": 0
      });

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body).to.be.deep.equal({ message: 'There is no team with such id!' });
  });
});
