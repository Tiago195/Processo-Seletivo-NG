import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorApi } from '../utils/errorGenerate';
import { Token } from '../utils/jwt';

const validToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    Token.decodeToken(authorization as string);
  } catch (error: any) {
    next(new ErrorApi(error.message, StatusCodes.UNAUTHORIZED));
  }

  next();
};

export { validToken };
