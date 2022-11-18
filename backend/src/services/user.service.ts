import { User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { ErrorApi } from '../utils/errorGenerate';

export class UserService {
  private readonly _repository: UserRepository;

  constructor (repository: UserRepository) {
    this._repository = repository;
  }

  public async create (user: User) {
    const userExist = await this._repository.getByUserName(user.username);

    if (userExist) throw new ErrorApi('User already exist', StatusCodes.CONFLICT);
    const newUser = await this._repository.create(user);

    return newUser;
  }
}

export const userService = new UserService(userRepository);
