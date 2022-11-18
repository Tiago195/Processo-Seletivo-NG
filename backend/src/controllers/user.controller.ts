import { Request, Response } from 'express';
import { UserService, userService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';

export class UserController {
  private readonly _service: UserService;

  constructor (service: UserService) {
    this._service = service;
    this.create = this.create.bind(this);
  }

  public async create (req: Request, res: Response) {
    const user = await this._service.create(req.body);

    res.status(StatusCodes.OK).json(user);
  }

  public async login (req: Request, res: Response) { }

  public async getAll (req: Request, res: Response) { }
}

export const userController = new UserController(userService);
