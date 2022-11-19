import 'express-async-errors';
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validBody } from '../middlewares/validBody.middleware';
import { UserSchema } from '../utils/schemas';
import { validToken } from '../middlewares/validToken.middleware';

const userRouter = Router();

userRouter.post('/', validBody(UserSchema), userController.create);

userRouter.post('/login', validBody(UserSchema), userController.login);

userRouter.get('/', validToken, userController.getAll);

export { userRouter };
