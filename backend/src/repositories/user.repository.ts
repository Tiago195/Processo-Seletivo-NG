import { User } from '@prisma/client';
import { db } from '../db';

export class UserRepository {
  public async create (user: User) {
    const { password, ...userWithoutPassword } = await db.user.create({
      select: {
        id: true,
        username: true,
        password: true,
        account: {
          select: {
            balance: true
          }
        },
        accountId: true
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

    return userWithoutPassword;
  }

  public async getByUserName (username: string) {
    return await db.user.findUnique({
      select: {
        id: true,
        username: true,
        password: true,
        account: {
          select: {
            balance: true
          }
        },
        accountId: true
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
