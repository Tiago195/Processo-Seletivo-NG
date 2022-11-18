import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { newTrasaction } from '../interfaces/ITransaction.interface';
import { transactionService, TransactionService } from '../services/transaction.service';
import { Token } from '../utils/jwt';

export class TransactionController {
  private readonly _service: TransactionService;

  constructor (service: TransactionService) {
    this._service = service;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create (req: Request, res: Response) {
    const { username } = Token.decodeToken(req.headers.authorization as string) as User;

    const transaction = await this._service.create(req.body, username);

    res.status(StatusCodes.CREATED).json(transaction);
  }

  public async getAll (req: Request, res: Response) {
    const { id } = Token.decodeToken(req.headers.authorization as string) as User;

    const transactions = await this._service.getAll(req.query, id);

    res.status(StatusCodes.OK).json(transactions);
  }
}

export const transactionController = new TransactionController(transactionService);
