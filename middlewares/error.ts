import type { ErrorRequestHandler } from "express";
import { ApiError } from "@/lib/api-error";
import { ApiResponse } from "@/lib/api-response";

export const errorMiddleware: ErrorRequestHandler = (err, _, res, __) => {
  if (err instanceof ApiError)
    return ApiResponse.error(res, err.status, err.message);

  console.error("Unhandled error:", err);

  return ApiResponse.error(res, 500, "Internal server error");
};
