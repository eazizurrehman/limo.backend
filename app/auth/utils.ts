import JWT from "jsonwebtoken";
import { env } from "@/env";

export interface UserTokenPayload {
  id: string;
}

export function createUserToken(payload: UserTokenPayload) {
  const token = JWT.sign(payload, env.JWT_SECRET);
  return token;
}

export function verifyUserToken(token: string) {
  try {
    const payload = JWT.verify(token, env.JWT_SECRET) as UserTokenPayload;
    return payload;
  } catch (_error) {
    return null;
  }
}
