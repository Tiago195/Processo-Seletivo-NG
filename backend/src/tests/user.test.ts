import sinon from 'sinon';
import { describe } from 'mocha';
import chai from 'chai';

import chaiHttp from 'chai-http';
import { User } from '@prisma/client';
import { app } from '../app';
// import { UserRepository } from '../repositories/user.repository';
import { userRepository } from '../repositories/user.repository';
// import { describe } from 'node:test';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes rota user', () => {
  const user: User = {
    accountId: 1,
    id: 1,
    password: 'senha criptografada',
    username: 'user'
  };

  const newUser = {
    password: 'Senha123',
    username: 'user'
  };

  const failUser = {
    password: 'password sem numero',
    username: 'user'
  };

  describe('POST user caso de sucesso', () => {
    before(() => {
      sinon.stub(userRepository, 'create').resolves(user);
      sinon.stub(userRepository, 'getByUserName').resolves(undefined);
    });

    after(() => {
      (userRepository.create as sinon.SinonStub).restore();
      (userRepository.getByUserName as sinon.SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retonar os dados do novo usuario e seu token', async () => {
      const response = await chai.request(app).post('/user').send(newUser);

      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('accountId');
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('username');
      expect(response.status).to.have.equal(200);
    });
  });

  describe('POST user caso de falha', () => {
    before(() => {
      sinon.stub(userRepository, 'getByUserName').resolves(user);
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
});
