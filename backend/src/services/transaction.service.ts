import { StatusCodes } from 'http-status-codes';
import { IQueryFilter, newTrasaction } from '../interfaces/ITransaction.interface';
import { transactionRepository, TransactionRepository } from '../repositories/transaction.repository';
import { ErrorApi } from '../utils/errorGenerate';

export class TransactionService {
  private readonly _repository: TransactionRepository;

  constructor (repository: TransactionRepository) {
    this._repository = repository;
  }

  public async create (transaction: newTrasaction, username: string) {
    const existCreditedAccountId = await this._repository.getUserById(transaction.username);
    const existDebitedAccountId = await this._repository.getUserById(username);

    if (transaction.username === username) throw new ErrorApi('Unathorized transaction', StatusCodes.UNAUTHORIZED);

    if (!existCreditedAccountId) throw new ErrorApi('User not found', StatusCodes.NOT_FOUND);

    if (existDebitedAccountId!.account.balance - transaction.value < 0) throw new ErrorApi('insufficient balance', StatusCodes.BAD_REQUEST);

    const response = {
      transaction: await this._repository.create(existDebitedAccountId!.id, existCreditedAccountId.id, transaction.value),
      balance: existDebitedAccountId!.account.balance - transaction.value
    };

    return response;
  }

  public async getAll (query: IQueryFilter, id: number) {
    return await this._repository.getAll(query, id);
  }
}

export const transactionService = new TransactionService(transactionRepository);
