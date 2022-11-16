import "express-async-errors";
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { db } from "../db";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { validBody } from "../middlewares/validBody.middleware";
import { UserSchema } from "../utils/schemas";

const userRouter = Router();

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const usercontroller = new UserController(userService);

userRouter.post("/", validBody(UserSchema), usercontroller.create);

export { userRouter };