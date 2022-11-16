import { PrismaClient, User } from "@prisma/client";
import by from "bcrypt";
import { Token } from "../utils/jwt";
// import { db } from "../db";

class UserRepository {
  private _db: PrismaClient;

  constructor(db: PrismaClient) {
    this._db = db;
    db.user;
  }

  private encodePassword(password: string) {
    const salt = by.genSaltSync(5);
    const hash = by.hashSync(password, salt);

    return hash
  }

  public async create(user: User) {
    const hash = this.encodePassword(user.password);

    const { password, ...newUser } = await this._db.user.create({
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

  public async getByUserName(username: string) {
    return this._db.user.findUnique({ where: { username } })
  }
}

export { UserRepository }