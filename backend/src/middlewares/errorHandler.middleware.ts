import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorApi } from '../utils/errorGenerate';

const errorHandler = (er: ErrorApi, req: Request, res: Response, next: NextFunction) => {
  if (er.statusCode) return res.status(er.statusCode).json({ message: er.message });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: er.message });
};

export { errorHandler };
