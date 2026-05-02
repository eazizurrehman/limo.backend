import type { NextFunction, Request, Response } from "express";
import { verifyUserToken } from "@/app/auth/utils";

export function authenticationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) next();

    if (!header?.startsWith("Bearer")) {
      return res
        .status(400)
        .json({ error: "authorization header must start with Bearer" });
    }

    const token = header.split(" ")[1];

    if (!token)
      return res.status(400).json({
        error:
          "authorization header must start with Bearer and followed by token",
      });

    const user = verifyUserToken(token);

    // @ts-expect-error
    req.user = user;

    next();
  };
}

export function restrictToAuthenticatedUser() {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-expect-error
    if (!req.user)
      return res.status(401).json({ error: "Authentication Required" });
    return next();
  };
}
