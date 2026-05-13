import type { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "@/app/auth/utils";
import { ApiError } from "@/lib/api-error";

export function authenticationMiddleware() {
  return (req: Request, _: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) next();

    if (!header?.startsWith("Bearer"))
      throw ApiError.badRequest(
        "authorization header must start with Bearer and followed by token",
      );

    const token = header.split(" ")[1];

    if (!token)
      throw ApiError.badRequest(
        "authorization header must start with Bearer and followed by token",
      );

    const user = verifyUserToken(token);

    // @ts-expect-error
    req.user = user;

    next();
  };
}

export function restrictToAuthenticatedUser() {
  return (req: Request, _: Response, next: NextFunction) => {
    // @ts-expect-error
    if (!req.user) throw ApiError.unauthorized("Authentication Required");

    return next();
  };
}
