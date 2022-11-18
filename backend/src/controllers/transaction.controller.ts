import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { transactionService, TransactionService } from '../services/transaction.service';

export class TransactionController {
  private readonly _service: TransactionService;

  constructor (service: TransactionService) {
    this._service = service;
    this.create = this.create.bind(this);
    this.getAll = this.getAll.bind(this);
  }

  public async create (req: Request, res: Response) {
    const transaction = await this._service.create(req.body);

    res.status(StatusCodes.CREATED).json(transaction);
  }

  public async getAll (req: Request, res: Response) { }
}

export const transactionController = new TransactionController(transactionService);
