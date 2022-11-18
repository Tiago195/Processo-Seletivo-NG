import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { transactionRouter } from './routes/transaction.routes';
import { userRouter } from './routes/user.routes';

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/transaction', transactionRouter);

app.get('/', (req, res) => {
  res.status(200).end('OK');
});

app.use(errorHandler);

export { app };
