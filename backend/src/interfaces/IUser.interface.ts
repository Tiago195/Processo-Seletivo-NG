import { Account, User } from '@prisma/client';

export type UserLogin = Omit<User, 'id' | 'accountId'>;

export type IUser = Omit<User, 'accountId'> & { account: Account };
