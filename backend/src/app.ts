import express from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { userRouter } from './routes/user.routes';

const app = express();
app.use(express.json());

app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.status(200).end('OK');
});

app.use(errorHandler);

export { app };
