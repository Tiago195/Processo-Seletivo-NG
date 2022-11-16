import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

const validBody = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);

  if (error) next({ message: error.message });

  next();
}

export { validBody }