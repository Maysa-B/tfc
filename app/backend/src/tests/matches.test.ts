import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';
import Matches from '../database/models/Matches';

chai.use(chaiHttp);

const { expect } = chai;

const match = {
  id: 1,
  homeTeam: 2,
  homeTeamGoals: 1,
  awayTeam: 3,
  awayTeamGoals: 3,
  inProgress: false
}

const arr = [match, match, match];

describe('Endpoint /matches tests', () => {
  let chaiHttpResponse: Response;

  afterEach(() => { sinon.restore() });

  it('Verify if we receive a matches[] when we GET /matches', async () => {
    sinon
    .stub(Matches, 'findAll')
    .resolves(arr as Matches[]);

    chaiHttpResponse = await chai.request(app)
      .get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.length(3);
  });

  it('Verify if we can finish a game with PATCH /:id/finish', async () => {
    sinon
    .stub(Matches, 'update')
    .resolves([2, arr as Matches[]]);

    chaiHttpResponse = await chai.request(app)
      .patch('/matches/1/finish');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Finished' });
  });

  it('Verify if we can update a game with PATCH /:id', async () => {
    sinon
    .stub(Matches, 'update')
    .resolves([2, arr as Matches[]]);

    const body = {
      homeTeamGoals: 2,
      awayTeamGoals: 2,
    }

    chaiHttpResponse = await chai.request(app)
      .patch('/matches/1').send(body);

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.deep.equal(body);
  });
});
