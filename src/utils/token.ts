import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../types";

const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    const payload = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as AccessTokenPayload;
    return payload;
  } catch (error) {
    return null;
  }
};

export { generateAccessToken, verifyAccessToken };
