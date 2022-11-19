import sinon from 'sinon';
import { describe } from 'mocha';
import chai from 'chai';

import chaiHttp from 'chai-http';
import { app } from '../app';
import { userRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/IUser.interface';
import { Token } from '../utils/jwt';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes rota user', () => {
  const userWithAccount: IUser = {
    account: {
      balance: 100,
      id: 1
    },
    password: '$2b$05$3NMZ4o6D1h2/p5RIqOQbreCeRGnJZdkIrlU7A2BYbHeD9Uh4d9ycO',
    id: 1,
    username: 'user'
  };

  const users = [
    {
      accountId: 2,
      id: 2,
      username: 'tiagoo'
    },
    {
      accountId: 3,
      id: 3,
      username: 'fadiga'
    },
    {
      accountId: 4,
      id: 4,
      username: 'ruy'
    },
    {
      accountId: 5,
      id: 5,
      username: 'santos'
    }
  ];

  const newUser = {
    password: 'Senha123',
    username: 'user'
  };

  const incorrectPassword = {
    password: 'Incorr3ct',
    username: 'user'
  };

  const failUser = {
    password: 'password invalido',
    username: 'user'
  };

  describe('POST user create caso de sucesso', () => {
    before(() => {
      sinon.stub(userRepository, 'create').resolves(userWithAccount);
      sinon.stub(userRepository, 'getByUserName').resolves(undefined);
    });

    after(() => {
      (userRepository.create as sinon.SinonStub).restore();
      (userRepository.getByUserName as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona os dados do novo usuario e seu token', async () => {
      const response = await chai.request(app).post('/user').send(newUser);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('account');
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('username');
      expect(response.status).to.have.equal(200);
    });
  });

  describe('POST user create caso de falha', () => {
    before(() => {
      sinon.stub(userRepository, 'getByUserName').resolves(userWithAccount);
    });

    after(() => {
      (userRepository.getByUserName as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona um erro com status 409', async () => {
      const response = await chai.request(app).post('/user').send(newUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(409);
    });

    it('Verifica se a resposta da requisição retona um erro com status 400', async () => {
      const response = await chai.request(app).post('/user').send(failUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(400);
    });
  });

  describe('POST user login caso de sucesso', () => {
    before(() => {
      sinon.stub(userRepository, 'getByUserName').resolves(userWithAccount);
    });

    after(() => {
      (userRepository.getByUserName as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona os dados do usuario logado e seu token', async () => {
      const response = await chai.request(app).post('/user/login').send(newUser);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('account');
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('username');
      expect(response.status).to.have.equal(200);
    });
  });

  describe('POST user login caso de falha', () => {
    before(() => {
      sinon.stub(userRepository, 'getByUserName')
        .onCall(0).resolves(undefined)
        .onCall(1).resolves(userWithAccount);
    });

    after(() => {
      (userRepository.getByUserName as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona um erro se o usuario não for encontrado com status 400', async () => {
      const response = await chai.request(app).post('/user/login').send(newUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(400);
    });

    it('Verifica se a resposta da requisição retona um erro se a senha for incorreta com status 400', async () => {
      const response = await chai.request(app).post('/user/login').send(incorrectPassword);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(400);
    });
  });

  describe('GET user getAll caso de sucesso', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken')
        .onCall(0).resolves(true)
        .onCall(1).throws();
      sinon.stub(userRepository, 'getAll').resolves(users);
    });

    after(() => {
      (userRepository.getAll as sinon.SinonStub).restore();
      (Token.decodeToken as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona os dados dos usuarios', async () => {
      const response = await chai.request(app).get('/user');

      expect(response.status).to.have.equal(200);
      expect(response.body[0]).to.have.property('id');
      expect(response.body[0]).to.have.property('accountId');
      expect(response.body[0]).to.have.property('username');
    });

    it('Verifica se a resposta da requisição retona um erro porque usuario n informou token', async () => {
      const response = await chai.request(app).get('/user');

      expect(response.status).to.have.equal(401);
    });
  });
});
