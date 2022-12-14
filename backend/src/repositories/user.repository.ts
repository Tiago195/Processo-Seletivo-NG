import { User } from '@prisma/client';
import { db } from '../db';

export class UserRepository {
  public async create (user: User) {
    return await db.user.create({
      select: {
        id: true,
        username: true,
        password: true,
        account: true
      },
      data: {
        username: user.username,
        password: user.password,
        account: {
          create: {
            balance: 100
          }
        }
      }
    });
  }

  public async getByUserName (username: string) {
    return await db.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        account: true
      },
      where: { username }
    });
  }

  public async getAll (q: string) {
    return await db.user.findMany({
      select: {
        accountId: true,
        id: true,
        username: true
      },
      where: {
        username: {
          contains: q
        }
      }
    });
  }
}

export const userRepository = new UserRepository();
