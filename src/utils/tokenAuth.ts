import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./token";

const AuthenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token invalid" });
  else {
    const payload = verifyAccessToken(token);
    console.log(payload);

    if (!payload) return res.status(403).json({ messsage: "Token expired" });
    else {
      req.user = payload;
      next();
    }
  }
};

export { AuthenticateRequest };
