import { Transaction } from '@prisma/client';
export const transactions: Transaction[] = [
  {
    id: 1,
    creditedAccountId: 2,
    debitedAccountId: 1,
    value: 20,
    createdAt: new Date()
  },
  {
    id: 2,
    creditedAccountId: 2,
    debitedAccountId: 1,
    value: 20,
    createdAt: new Date()
  },
  {
    id: 3,
    creditedAccountId: 1,
    debitedAccountId: 2,
    value: 20,
    createdAt: new Date()
  },
  {
    id: 4,
    creditedAccountId: 1,
    debitedAccountId: 2,
    value: 20,
    createdAt: new Date()
  }
];
