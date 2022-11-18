// import { User, Transaction, Account } from '@prisma/client';
import { db } from '../db';
import { IQueryFilter } from '../interfaces/ITransaction.interface';

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

  private createTransaction (debitedAccountId: number, creditedAccountId: number, value: number) {
    return db.transaction.create({ data: { value, debitedAccountId, creditedAccountId } });
  }

  public async create (debitedAccountId: number, creditedAccountId: number, value: number) {
    return (await db.$transaction([
      this.createTransaction(debitedAccountId, creditedAccountId, value),
      this.cashIn(creditedAccountId, value),
      this.cashOut(debitedAccountId, value)
    ]))[0];
  }

  public async getUserById (username: string) {
    return await db.user.findUnique({
      where: { username },
      select: {
        username: true,
        account: true,
        id: true
      }
    });
  }

  public async getAll (query: IQueryFilter, id: number) {
    const gte = new Date(query.data ?? '2022-01-01');
    const lte = new Date(query.data ?? Date.now());

    if (query.data) lte.setDate(gte.getDate() + 1);

    return await db.transaction.findMany({
      where: {
        createdAt: { gte, lte },
        creditedAccountId: query.in ? id : undefined,
        debitedAccountId: query.out ? id : undefined,
        OR: [
          {
            creditedAccountId: id
          },
          {
            debitedAccountId: id
          }
        ]
      }
    });
  }
}

export const transactionRepository = new TransactionRepository();
