// import { User, Transaction, Account } from '@prisma/client';
import { db } from '../db';
import { newTrasaction } from '../interfaces/ITransaction.interface';

export class TransactionRepository {
  private cashIn (accountId: number, balance: number) {
    return db.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balance
        }
      }
    });
  }

  private cashOut (accountId: number, balance: number) {
    return db.account.update({
      where: { id: accountId },
      data: {
        balance: {
          decrement: balance
        }
      }
    });
  }

  private createTransaction (transaction: newTrasaction) {
    return db.transaction.create({
      data: {
        value: transaction.value,
        debitedAccountId: transaction.debitedAccountId,
        creditedAccountId: transaction.creditedAccountId
      }
    });
  }

  public async create (transaction: newTrasaction) {
    return (await db.$transaction([
      this.createTransaction(transaction),
      this.cashIn(transaction.creditedAccountId, transaction.value),
      this.cashOut(transaction.debitedAccountId, transaction.value)
    ]))[0];
  }

  public async getAccountById (id: number) {
    return await db.account.findUnique({
      where: { id }
    });
  }
}

export const transactionRepository = new TransactionRepository();
