import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser.interface';

class Token {
  private static readonly secret = process.env.SECRET ?? 'segredo';
  private static readonly options: SignOptions = { expiresIn: '24h' };

  public static encodeToken (user: Omit<IUser, 'password'>) {
    return jwt.sign(user, this.secret, this.options);
  }

  public static decodeToken (token: string) {
    return jwt.verify(token, this.secret);
  }
}

export { Token };
