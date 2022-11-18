import sinon, { SinonStub } from 'sinon';
import { describe } from 'mocha';
import chai from 'chai';

import chaiHttp from 'chai-http';
import { app } from '../app';
import { transactionRepository } from '../repositories/transaction.repository';
import { Account, Transaction } from '@prisma/client';
import { Token } from '../utils/jwt';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes rota transaction', () => {
  const transaction: Transaction = {
    id: 1,
    debitedAccountId: 2,
    creditedAccountId: 1,
    value: 50,
    createdAt: new Date()
  };

  const newTransaction = {
    username: 'UserOne',
    value: 50
  };

  const invalidValue = {
    debitedAccountId: 2,
    creditedAccountId: 1,
    value: 200
  };

  const failTransaction = {
    debitedAccountId: 'invalid id',
    creditedAccountId: 1,
    value: 200
  };

  const UserOne = {
    id: 1,
    username: 'userOne',
    account: {
      id: 1,
      balance: 100
    }
  };

  const UserTwo = {
    id: 2,
    username: 'userTwo',
    account: {
      id: 2,
      balance: 100
    }
  };

  describe('POST transaction create caso de sucesso', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken').resolves(true);
      sinon.stub(transactionRepository, 'getUserById')
        .onCall(0).resolves(UserOne)
        .onCall(1).resolves(UserTwo);
      sinon.stub(transactionRepository, 'create').resolves(transaction);
    });

    after(() => {
      (transactionRepository.create as SinonStub).restore();
      (transactionRepository.getUserById as SinonStub).restore();
      (Token.decodeToken as SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona os dados da nova transaction', async () => {
      const response = await chai.request(app).post('/transaction').send(newTransaction);

      expect(response.status).to.have.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('debitedAccountId');
      expect(response.body).to.have.property('creditedAccountId');
      expect(response.body).to.have.property('value');
      expect(response.body).to.have.property('createdAt');
    });
  });

  describe('POST transaction create caso de falha', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken').resolves(true);
      sinon.stub(transactionRepository, 'getUserById')
        .onCall(0).resolves(undefined)
        .onCall(1).resolves(undefined)
        .onCall(2).resolves(UserOne)
        .onCall(3).resolves(UserTwo);
    });

    after(() => {
      (transactionRepository.getUserById as SinonStub).restore();
      (Token.decodeToken as SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona um erro se a conta não for encontrada com status 404 ', async () => {
      const response = await chai.request(app).post('/transaction').send(newTransaction);

      expect(response.status).to.have.equal(404);
    });

    it('Verifica se a resposta da requisição retona um erro se a conta não tiver o valor necessario com status 400', async () => {
      const response = await chai.request(app).post('/transaction').send(invalidValue);

      expect(response.status).to.have.equal(400);
    });

    it('Verifica se a resposta da requisição retona um erro se os dados recebidos forem invalidos status 400', async () => {
      const response = await chai.request(app).post('/transaction').send(failTransaction);

      expect(response.status).to.have.equal(400);
    });
  });
});
