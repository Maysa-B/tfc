import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';
import TeamModel from '../database/models/Teams';
import ITeams from '../interfaces/requests/ITeams';

chai.use(chaiHttp);

const { expect } = chai;

const teamMock: ITeams = {
  id: 1,
  teamName: 'team-mock-name',
}

const teamArr: ITeams[] = [teamMock, teamMock, teamMock];

describe('Endpoint /teams tests', () => {
  let chaiHttpResponse: Response;

  afterEach(() => { sinon.restore() });

  it('Verify if we receive a team when we GET /teams/:id', async () => {
    sinon
    .stub(TeamModel, 'findOne')
    .resolves(teamMock as TeamModel);

    chaiHttpResponse = await chai.request(app)
      .get('/teams/1');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('id');
    expect(chaiHttpResponse.body).to.haveOwnProperty('teamName');
  });

  it('Verify if we receive a team[] when we GET /teams', async () => {
    sinon
    .stub(TeamModel, 'findAll')
    .resolves(teamArr as TeamModel[]);

    chaiHttpResponse = await chai.request(app)
      .get('/teams');

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.have.length(3);
    expect(chaiHttpResponse.body[0]).to.haveOwnProperty('id');
    expect(chaiHttpResponse.body[0]).to.haveOwnProperty('teamName');
  });
});
