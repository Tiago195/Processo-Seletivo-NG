import 'express-async-errors';
import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { validToken } from '../middlewares/validToken.middleware';
import { validBody } from '../middlewares/validBody.middleware';
import { TransactionSchema } from '../utils/schemas';

const transactionRouter = Router();

transactionRouter.post('/', validBody(TransactionSchema), validToken, transactionController.create);

transactionRouter.get('/', validToken, transactionController.getAll);

export { transactionRouter };
