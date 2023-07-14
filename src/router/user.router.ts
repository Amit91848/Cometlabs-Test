import { Router } from "express";
import { UserController } from "../controllers";
import { ISignupUser } from "../types";

const userRoute = Router();

userRoute.post("/signup", UserController.signup);
userRoute.post("/login", UserController.login);

export { userRoute };
