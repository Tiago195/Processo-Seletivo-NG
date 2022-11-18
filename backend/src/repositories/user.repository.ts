import { User } from '@prisma/client';
import by from 'bcrypt';
import { Token } from '../utils/jwt';
import { db } from '../db';

export class UserRepository {
  private encodePassword (password: string): string {
    const salt = by.genSaltSync(5);
    const hash = by.hashSync(password, salt);

    return hash;
  }

  public async create (user: User) {
    const hash = this.encodePassword(user.password);

    const { password, ...newUser } = await db.user.create({
      data: {
        username: user.username,
        password: hash,
        account: {
          create: {
            balance: 100
          }
        }
      }
    });

    return { ...newUser, token: Token.encodeToken(newUser) };
  }

  public async getByUserName (username: string) {
    return await db.user.findUnique({ where: { username } });
  }
}

export const userRepository = new UserRepository();
