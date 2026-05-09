import type { NextFunction, RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "@/lib/api-error";
import { validateData } from "@/lib/zod";

type ValidationSource = "body" | "query" | "params";

export function validate<TSchema extends ZodType>(
  schema: TSchema,
): RequestHandler {
  return async (req, _, next: NextFunction) => {
    const source = schema.meta()?.source as ValidationSource | undefined;

    if (!source)
      throw ApiError.badRequest(
        "Validation schema must have a 'source' meta property",
      );

    const data = await validateData({
      schema,
      raw: req[source],
    });

    req.validated = {
      ...req.validated,
      [source]: data,
    };

    return next();
  };
}
