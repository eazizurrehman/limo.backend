import type { ParamsDictionary, ParsedQs } from "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request<
    P = ParamsDictionary,
    ResBody = unknown,
    ReqBody = unknown,
    ReqQuery = ParsedQs,
    LocalsObj extends Record<string, unknown> = Record<string, unknown>,
  > {
    validated: {
      body?: ReqBody;
      query?: ReqQuery;
      params?: P;
    };
  }
}

declare global {
  namespace Express {
    interface Request<
      P = ParamsDictionary,
      ResBody = unknown,
      ReqBody = unknown,
      ReqQuery = ParsedQs,
      LocalsObj extends Record<string, unknown> = Record<string, unknown>,
    > {
      validated: {
        body?: ReqBody;
        query?: ReqQuery;
        params?: P;
      };
    }
  }
}
