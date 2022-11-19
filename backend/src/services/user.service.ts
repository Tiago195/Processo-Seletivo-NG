import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { UserLogin } from '../interfaces/IUser.interface';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { ErrorApi } from '../utils/errorGenerate';
import by from 'bcrypt';
import { Token } from '../utils/jwt';

export class UserService {
  private readonly _repository: UserRepository;

  constructor (repository: UserRepository) {
    this._repository = repository;
  }

  private encodePassword (password: string): string {
    const salt = by.genSaltSync(Number(process.env.SALT) ?? 5);
    const hash = by.hashSync(password, salt);

    return hash;
  }

  public async create (user: User) {
    const userExist = await this._repository.getByUserName(user.username);
    if (userExist) throw new ErrorApi('User already exist', StatusCodes.CONFLICT);

    const hash = this.encodePassword(user.password);
    const { password: _removed, ...userWithoutPassword } = await this._repository.create({ ...user, password: hash });

    return { ...userWithoutPassword, token: Token.encodeToken(userWithoutPassword) };
  }

  public async login (user: UserLogin) {
    const userExist = await this._repository.getByUserName(user.username);
    if (!userExist) throw new ErrorApi('Username or password is invalid', StatusCodes.BAD_REQUEST);

    const isValidLogin = await by.compare(user.password, userExist.password);
    if (!isValidLogin) throw new ErrorApi('Username or password is invalid', StatusCodes.BAD_REQUEST);

    const { password: _removed, ...userWithoutPassword } = userExist;

    return { ...userWithoutPassword, token: Token.encodeToken(userWithoutPassword) };
  }

  public async getAll (q: string) {
    const users = await this._repository.getAll(q);

    return users;
  }
}

export const userService = new UserService(userRepository);
