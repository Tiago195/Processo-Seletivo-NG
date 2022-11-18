import { Transaction } from '@prisma/client';

export type newTrasaction = Omit<Transaction, 'id' | 'createdAt'>;
