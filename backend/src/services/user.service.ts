import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { UserRepository } from "../repositories/user.repository";
import { ErrorApi } from "../utils/errorGenerate";

class UserService {
  private _repository: UserRepository;

  constructor(repository: UserRepository) {
    this._repository = repository;
  }

  public async create(user: User) {
    const userExist = await this._repository.getByUserName(user.username);

    if (userExist) throw new ErrorApi("User already exist", StatusCodes.CONFLICT);
    const newUser = await this._repository.create(user);

    return newUser
  }
}

export { UserService }