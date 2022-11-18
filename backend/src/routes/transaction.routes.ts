import 'express-async-errors';
import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { validToken } from '../middlewares/validToken.middleware';
// import { db } from "../db";
// import { UserRepository } from "../repositories/user.repository";
// import { UserService } from "../services/user.service";
// import { validBody } from '../middlewares/validBody.middleware';
// import { UserSchema } from '../utils/schemas';

const transactionRouter = Router();

// export const userRepository = new UserRepository();
// const userService = new UserService(userRepository);
// const usercontroller = new UserController(userService);

transactionRouter.post('/', validToken, transactionController.create);

// transactionRouter.post('/login', validBody(UserSchema), userController.login);

// transactionRouter.get('/', userController.getAll);

export { transactionRouter };
