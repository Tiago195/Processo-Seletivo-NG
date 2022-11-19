import sinon, { SinonStub } from 'sinon';
import { describe } from 'mocha';
import chai from 'chai';

import chaiHttp from 'chai-http';
import { app } from '../app';
import { transactionRepository } from '../repositories/transaction.repository';
import { Transaction } from '@prisma/client';
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

  const newTransactionUserOne = {
    username: 'userOne',
    value: 50
  };

  const newTransactionUserTwo = {
    username: 'userTwo',
    value: 50
  };

  const invalidValue = {
    username: 'userTwo',
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

  const transactions = [
    {
      id: 1,
      debitedAccountId: 1,
      creditedAccountId: 2,
      value: 50,
      createdAt: new Date()
    },
    {
      id: 2,
      debitedAccountId: 1,
      creditedAccountId: 2,
      value: 10,
      createdAt: new Date()
    },
    {
      id: 3,
      debitedAccountId: 1,
      creditedAccountId: 2,
      value: 10,
      createdAt: new Date()
    }
  ];

  describe('POST transaction create caso de sucesso', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken').returns(UserOne);
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
      const response = await chai.request(app).post('/transaction').send(newTransactionUserTwo);

      expect(response.status).to.have.equal(201);
      expect(response.body).to.have.property('transaction');
      expect(response.body).to.have.property('balance');
    });
  });

  describe('POST transaction create caso de falha', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken').returns(UserOne);
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
      const response = await chai.request(app).post('/transaction').send(newTransactionUserTwo);

      expect(response.status).to.have.equal(404);
    });

    it('Verifica se a resposta da requisição retona um erro se a conta não tiver o valor necessario com status 400', async () => {
      const response = await chai.request(app).post('/transaction').send(invalidValue);

      expect(response.status).to.have.equal(400);
    });

    it('Verifica se a resposta da requisição retona um erro se a conta debitada for igual a creditada ', async () => {
      const response = await chai.request(app).post('/transaction').send(newTransactionUserOne);

      expect(response.status).to.have.equal(401);
    });

    it('Verifica se a resposta da requisição retona um erro se os dados recebidos forem invalidos status 400', async () => {
      const response = await chai.request(app).post('/transaction').send(failTransaction);

      expect(response.status).to.have.equal(400);
    });
  });

  describe('GET transaction getall de sucesso', () => {
    before(() => {
      sinon.stub(Token, 'decodeToken').resolves(true);
      sinon.stub(transactionRepository, 'getAll').resolves(transactions);
    });

    after(() => {
      (Token.decodeToken as SinonStub).restore();
      (transactionRepository.getAll as SinonStub).restore();
    });

    it('Verifica se a resposta da requisição retona os dados corretos', async () => {
      const response = await chai.request(app).get('/transaction');

      expect(response.status).to.have.equal(200);
    });
  });
});
