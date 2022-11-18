import 'express-async-errors';
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
// import { db } from "../db";
// import { UserRepository } from "../repositories/user.repository";
// import { UserService } from "../services/user.service";
import { validBody } from '../middlewares/validBody.middleware';
import { UserSchema } from '../utils/schemas';
import { validToken } from '../middlewares/validToken.middleware';

const userRouter = Router();

// export const userRepository = new UserRepository();
// const userService = new UserService(userRepository);
// const usercontroller = new UserController(userService);

userRouter.post('/', validBody(UserSchema), userController.create);

userRouter.post('/login', validBody(UserSchema), userController.login);

userRouter.get('/', validToken, userController.getAll);

export { userRouter };
