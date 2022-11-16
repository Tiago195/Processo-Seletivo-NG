import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";

class UserController {
  private _service: UserService;

  constructor(service: UserService) {
    this._service = service;
    this.create = this.create.bind(this);
  }

  public async create(req: Request, res: Response) {
    const user = await this._service.create(req.body);

    res.status(StatusCodes.OK).json(user);
  }
}

export { UserController }