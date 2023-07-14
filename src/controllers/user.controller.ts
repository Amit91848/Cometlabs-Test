import { NextFunction, Response } from "express";

import { User } from "../models";
import { ILoginUser, ISignupUser, RequestParams, UserRole } from "../types";
import UserModel from "../models/User.model";
import { generateAccessToken } from "../utils";

/**
 *
 * Signup for user
 * @requires email, password, username
 * @returns email, accesstoken
 */
const signup = async (
  req: RequestParams<ISignupUser, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username)
      return res
        .status(400)
        .json({ message: "Fields email, password and username are required" });

    const doesExist = await UserModel.findOne({ email });

    if (doesExist)
      return res
        .status(409)
        .json({ message: "User with that email already exists!" });

    const user: User = {
      createdAt: new Date(),
      email,
      password,
      role: UserRole.User,
      username,
    };

    const createdUser = await UserModel.create(user);

    const accessToken = generateAccessToken({
      email: createdUser.email,
      id: createdUser._id,
      role: createdUser.role,
    });
    res.json({ success: true, email, accessToken });
  } catch (err) {
    next(err);
  }
};
/**
 * Login for user
 * @requires email, password
 * @returns email, accessToken
 */

const login = async (
  req: RequestParams<ILoginUser, any, any>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, email } = req.body;

    if (!password || !email)
      return res
        .status(400)
        .json({ message: "Email and password fields are required" });

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid Credentials" });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) res.status(400).json({ message: "Invalid Credentials" });

    const accessToken = generateAccessToken({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.json({ success: true, email, accessToken });
  } catch (err) {
    next(err);
  }
};

export { signup, login };
