import { StatusCodes } from 'http-status-codes';
import { newTrasaction } from '../interfaces/ITransaction.interface';
import { transactionRepository, TransactionRepository } from '../repositories/transaction.repository';
import { ErrorApi } from '../utils/errorGenerate';

export class TransactionService {
  private readonly _repository: TransactionRepository;

  constructor (repository: TransactionRepository) {
    this._repository = repository;
  }

  public async create (transaction: newTrasaction) {
    const existCreditedAccountId = await this._repository.getAccountById(transaction.creditedAccountId);
    const existDebitedAccountId = await this._repository.getAccountById(transaction.debitedAccountId);

    if (!existCreditedAccountId || !existDebitedAccountId) throw new ErrorApi('Credited or Devited account invalid', StatusCodes.BAD_REQUEST);

    if (existDebitedAccountId.balance - transaction.value < 0) throw new ErrorApi('Value invalid', StatusCodes.BAD_REQUEST);

    return await this._repository.create(transaction);
  }
}

export const transactionService = new TransactionService(transactionRepository);
