import { User } from '@prisma/client';

export type UserLogin = Omit<User, 'id' | 'accountId'>;
