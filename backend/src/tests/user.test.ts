import sinon from 'sinon';
import { describe } from 'mocha';
import chai from 'chai';

import chaiHttp from 'chai-http';
import { app } from '../app';
// import { UserRepository } from '../repositories/user.repository';
import { userRepository } from '../repositories/user.repository';
import { IUser } from '../interfaces/IUser.interface';
// import { describe } from 'node:test';

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

  const newUser = {
    password: 'Senha123',
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

    it('Verifica se a resposta da requisição retonar os dados do novo usuario e seu token', async () => {
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

    it('Verifica se a resposta da requisição retonar um erro com status 409', async () => {
      const response = await chai.request(app).post('/user').send(newUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(409);
    });

    it('Verifica se a resposta da requisição retonar um erro com status 400', async () => {
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

    it('Verifica se a resposta da requisição retonar os dados do usuario logado e seu token', async () => {
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

    it('Verifica se a resposta da requisição retonar um erro se o usuario não for encontrado com status 400', async () => {
      const response = await chai.request(app).post('/user/login').send(newUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(400);
    });

    it('Verifica se a resposta da requisição retonar um erro se a senha for incorreta com status 400', async () => {
      const response = await chai.request(app).post('/user/login').send(failUser);

      expect(response.body).to.have.property('message');
      expect(response.status).to.have.equal(400);
    });
  });
});
