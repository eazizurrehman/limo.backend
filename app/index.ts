import type { Express } from "express";
import express from "express";
import morgan from "morgan";
import { authRouter } from "@/app/auth/routes";
import { vehiclesRouter } from "@/app/vehicles/routes";
import { ApiResponse } from "@/lib/api-response";
import { errorMiddleware } from "@/middlewares/error";

export function createApplication(): Express {
  const app = express();

  app.use(express.json());
  app.use(morgan("tiny"));

  app.get("/health", (_, res) => {
    return ApiResponse.ok(res, "App is healthy!");
  });

  app.use("/auth", authRouter);
  app.use("/vehicles", vehiclesRouter);

  app.use(errorMiddleware);

  return app;
}
