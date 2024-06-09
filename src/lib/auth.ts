import { jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";

export interface UserJwtPayload {
  jti: string;
  iat: number;
}

export const get_jwt_secret = () => {
  const secret = process.env.JWT_KEY;

  if (!secret || secret.length === 0) {
    throw new Error("the environment veriable is not set");
  }

  return secret;
};

export const signJWT = async (data: any, jwt_key: string, options: { expiresIn: string } = { expiresIn: "1m" }) => {
  const token = await new SignJWT(data).setProtectedHeader({ alg: process.env.ALGORITHM! }).setJti(nanoid()).setIssuedAt().setExpirationTime(options.expiresIn).sign(new TextEncoder().encode(jwt_key));

  return token;
};

export const verifyAuth = async (token: string, jwt_key: string) => {
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(jwt_key));
    return verified.payload as UserJwtPayload;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
};
