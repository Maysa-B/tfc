import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import * as chaiHttp from 'chai-http';
import { app } from '../app';
import { Response } from 'superagent';
import UserModel from '../database/models/User';

chai.use(chaiHttp);

const { expect } = chai;

const modelResponseMock = {
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
  email: 'user@user.com'
}

const body = {
  password: 'secret_user',
  email: 'user@user.com'
}

const wrongRequest = {
  email: 'email@email.com',
  password: 'swrogPass'
}

describe('Endpoint /login tests', () => {
  let chaiHttpResponse: Response;

  afterEach(() => sinon.restore());

  it('Verify if we receive a token when using email and password correct', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(modelResponseMock as UserModel);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send(body);

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.haveOwnProperty('token');
  });

  it('Verify if we receive an error when using email/password incorrect', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .onFirstCall().resolves(null)
      .onSecondCall().resolves(modelResponseMock as UserModel);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send({ email: wrongRequest.email, password: body.password });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });

    chaiHttpResponse = await chai.request(app)
      .post('/login').send({ email: body.email, password: wrongRequest.password });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'Incorrect email or password' });
  });

  it('Verify if we receive an error when skip email/password', async () => {
    chaiHttpResponse = await chai.request(app)
      .post('/login').send({ password: body.password });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });

    chaiHttpResponse = await chai.request(app)
      .post('/login').send({ email: body.email });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('Verify if we can check the User Role on the endpoint GET /login/validate', async () => {
    sinon
      .stub(UserModel, 'findOne')
      .resolves(modelResponseMock as UserModel);

    chaiHttpResponse = await chai.request(app)
      .post('/login').send(body);

    const { token } = chaiHttpResponse.body;

    chaiHttpResponse = await chai.request(app)
      .get('/login/validate')
      .set('Authorization', token);

    expect(chaiHttpResponse.status).to.be.equal(200);
    // expect(chaiHttpResponse.body).to.deep.equal({ role: 'user' });
  });
});
