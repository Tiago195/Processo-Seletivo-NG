import { Request, Response } from 'express';
import { UserService, userService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

export class UserController {
  private readonly _service: UserService;

  constructor (service: UserService) {
    this._service = service;
    this.create = this.create.bind(this);
    this.login = this.login.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create (req: Request, res: Response) {
    const user = await this._service.create(req.body);

    res.status(StatusCodes.OK).json(user);
  }

  public async login (req: Request, res: Response) {
    const user = await this._service.login(req.body);

    res.status(StatusCodes.OK).json(user);
  }

  public async getAll (req: Request, res: Response) {
    const { q } = req.query;
    const users = await this._service.getAll(q as string);

    res.status(StatusCodes.OK).json(users);
  }
}

export const userController = new UserController(userService);
