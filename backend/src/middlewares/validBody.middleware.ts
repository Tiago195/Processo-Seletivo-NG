import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ObjectSchema } from 'joi';
import { ErrorApi } from '../utils/errorGenerate';

const validBody = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);

  if (error) next(new ErrorApi(error.message, StatusCodes.BAD_REQUEST));

  next();
};

export { validBody };
